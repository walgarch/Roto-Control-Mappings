#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fail = (message) => {
  throw new Error(message)
}
const check = (condition, message) => {
  if (!condition) fail(message)
}
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))
const sortedKeys = (object) => Object.keys(object).sort()
const sameKeys = (actual, expected) =>
  JSON.stringify(sortedKeys(actual)) === JSON.stringify([...expected].sort())
const sha256 = (path) => createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex')

const rootFields = {
  PLUGIN: ['version', 'type', 'name', 'hash', 'knobs', 'buttons'],
  MIDI: ['version', 'type', 'name', 'index', 'knobs', 'buttons'],
}
const controlFields = {
  PLUGIN: {
    knobs: ['controlIndex', 'mappedParam', 'paramHash', 'macroParam', 'minValue', 'maxValue', 'controlName', 'colorScheme', 'hapticMode', 'hapticIndent1', 'hapticIndent2', 'hapticSteps', 'stepNames'],
    buttons: ['controlIndex', 'mappedParam', 'paramHash', 'minValue', 'maxValue', 'controlName', 'colorScheme', 'ledOnColor', 'ledOffColor', 'hapticMode', 'hapticSteps', 'stepNames'],
  },
  MIDI: {
    knobs: ['controlIndex', 'controlMode', 'controlChannel', 'controlParam', 'nrpnAddress', 'minValue', 'maxValue', 'controlName', 'colorScheme', 'hapticMode', 'hapticIndent1', 'hapticIndent2', 'hapticSteps', 'stepNames'],
    buttons: ['controlIndex', 'controlMode', 'controlChannel', 'controlParam', 'nrpnAddress', 'minValue', 'maxValue', 'controlName', 'colorScheme', 'ledOnColor', 'ledOffColor', 'hapticMode', 'hapticSteps', 'stepNames'],
  },
}

const walkJson = (directory) => {
  const files = []
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) files.push(...walkJson(path))
    else if (name.endsWith('.json')) files.push(relative(root, path).replaceAll('\\', '/'))
  }
  return files
}

const catalog = readJson('catalog.json')
check(catalog.version === 1, 'catalog.json: unsupported version')
check(catalog.repository === 'Roto-Control-Mappings', 'catalog.json: repository name mismatch')
check(Array.isArray(catalog.mappings) && catalog.mappings.length > 0, 'catalog.json: mappings must be a non-empty array')

const ids = new Set()
const paths = new Set()
const entriesById = new Map()
const allowedStatuses = new Set(['canonical', 'candidate', 'fallback', 'archive'])
for (const entry of catalog.mappings) {
  check(typeof entry.id === 'string' && entry.id, 'catalog.json: mapping id is required')
  check(!ids.has(entry.id), `catalog.json: duplicate id ${entry.id}`)
  check(!paths.has(entry.path), `catalog.json: duplicate path ${entry.path}`)
  check(allowedStatuses.has(entry.status), `${entry.id}: invalid status ${entry.status}`)
  check(['PLUGIN', 'MIDI'].includes(entry.mode), `${entry.id}: invalid mode ${entry.mode}`)
  check(Array.isArray(entry.allowedColors) && entry.allowedColors.length > 0, `${entry.id}: allowedColors is required`)
  check(existsSync(resolve(root, entry.path)), `${entry.id}: missing mapping ${entry.path}`)
  check(existsSync(resolve(root, entry.documentation)), `${entry.id}: missing documentation ${entry.documentation}`)
  ids.add(entry.id)
  paths.add(entry.path)
  entriesById.set(entry.id, entry)
}

const discovered = walkJson(resolve(root, 'mappings')).sort()
check(JSON.stringify(discovered) === JSON.stringify([...paths].sort()), 'catalog.json and mappings/**/*.json differ')

const hashes = new Map()
const summaries = []
for (const entry of catalog.mappings) {
  const mapping = readJson(entry.path)
  const prefix = entry.path
  check(mapping.version === 1, `${prefix}: version must be 1`)
  check(mapping.type === entry.mode, `${prefix}: mode differs from catalog`)
  check(typeof mapping.name === 'string' && mapping.name, `${prefix}: name is required`)
  check(sameKeys(mapping, rootFields[entry.mode]), `${prefix}: unexpected root fields`)

  const maxIndex = entry.mode === 'PLUGIN' ? 63 : 31
  const maxControls = maxIndex + 1
  const maxSteps = entry.mode === 'PLUGIN' ? 24 : 16
  const allControls = []

  for (const kind of ['knobs', 'buttons']) {
    const controls = mapping[kind]
    check(Array.isArray(controls), `${prefix}: ${kind} must be an array`)
    check(controls.length <= maxControls, `${prefix}: too many ${kind}`)
    check(new Set(controls.map((control) => control.controlIndex)).size === controls.length, `${prefix}: duplicate ${kind} index`)

    for (let page = 0; page <= Math.floor(maxIndex / 8); page += 1) {
      const count = controls.filter((control) => Math.floor(control.controlIndex / 8) === page).length
      check(count <= 8, `${prefix}: ${kind} page ${page + 1} exceeds eight controls`)
    }

    for (const control of controls) {
      const label = `${prefix}: ${control.controlName || '<unnamed>'}`
      check(sameKeys(control, controlFields[entry.mode][kind]), `${label}: unexpected fields`)
      check(Number.isInteger(control.controlIndex) && control.controlIndex >= 0 && control.controlIndex <= maxIndex, `${label}: invalid controlIndex`)
      check(typeof control.controlName === 'string' && Buffer.byteLength(control.controlName, 'utf8') <= 12, `${label}: label exceeds 12 bytes`)
      check(entry.allowedColors.includes(control.colorScheme), `${label}: undeclared color ${control.colorScheme}`)
      check(Number.isInteger(control.hapticMode) && control.hapticMode >= 0 && control.hapticMode <= 2, `${label}: invalid hapticMode`)
      check(Number.isInteger(control.hapticSteps) && control.hapticSteps >= 0 && control.hapticSteps <= maxSteps, `${label}: invalid hapticSteps`)
      check(Array.isArray(control.stepNames) && control.stepNames.length === 16 && control.stepNames.every((step) => typeof step === 'string'), `${label}: stepNames must contain 16 strings`)
      check(Number.isInteger(control.minValue) && Number.isInteger(control.maxValue) && control.minValue <= control.maxValue, `${label}: invalid range`)

      if (entry.mode === 'PLUGIN') {
        check(Number.isInteger(control.mappedParam), `${label}: mappedParam must be an integer`)
        check(typeof control.paramHash === 'string' && /^[0-9a-f]{12}$/.test(control.paramHash), `${label}: invalid paramHash`)
        check(control.minValue === 0 && control.maxValue === (kind === 'knobs' ? 16383 : 127), `${label}: invalid PLUGIN range`)
        if (kind === 'knobs') check(typeof control.macroParam === 'boolean', `${label}: macroParam must be boolean`)
      } else {
        check(Number.isInteger(control.controlMode) && control.controlMode >= 0 && control.controlMode <= 1, `${label}: invalid controlMode`)
        check(Number.isInteger(control.controlChannel) && control.controlChannel >= 1 && control.controlChannel <= 16, `${label}: invalid MIDI channel`)
        check(Number.isInteger(control.controlParam) && control.controlParam >= 0 && control.controlParam <= 127, `${label}: invalid MIDI parameter`)
        check(Number.isInteger(control.nrpnAddress) && control.nrpnAddress >= 0 && control.nrpnAddress <= 16383, `${label}: invalid NRPN address`)
        check(control.minValue === 0 && control.maxValue === 127, `${label}: invalid MIDI range`)
        if (entry.reservedCc?.includes(control.controlParam) && control.controlMode === 0) fail(`${label}: uses reserved CC ${control.controlParam}`)
      }
      allControls.push(control)
    }
  }

  if (entry.mode === 'PLUGIN') {
    check(typeof mapping.hash === 'string' && /^[0-9a-f]{16}$/.test(mapping.hash), `${prefix}: invalid plugin hash`)
    check(mapping.hash === entry.pluginHash, `${prefix}: plugin hash differs from catalog`)
    const identities = allControls.map((control) => `${control.mappedParam}:${control.paramHash}`)
    check(new Set(identities).size === identities.length, `${prefix}: duplicate plugin identity`)
  } else {
    check(mapping.index === entry.setupIndex, `${prefix}: setup index differs from catalog`)
    const addresses = allControls.map((control) => `${control.controlMode}:${control.controlChannel}:${control.controlParam}:${control.nrpnAddress}`)
    check(new Set(addresses).size === addresses.length, `${prefix}: duplicate MIDI address`)
  }

  const digest = sha256(entry.path)
  if (!hashes.has(digest)) hashes.set(digest, [])
  hashes.get(digest).push(entry)
  summaries.push(`${entry.id}: ${entry.mode}, ${mapping.knobs.length} knobs, ${mapping.buttons.length} buttons, ${entry.status}`)
}

for (const duplicates of hashes.values()) {
  if (duplicates.length < 2) continue
  const active = duplicates.filter((entry) => entry.status !== 'archive')
  check(active.length <= 1, `byte-identical active mappings: ${duplicates.map((entry) => entry.id).join(', ')}`)
  for (const archived of duplicates.filter((entry) => entry.status === 'archive')) {
    check(archived.duplicateOf && duplicates.some((entry) => entry.id === archived.duplicateOf), `${archived.id}: duplicate archive must declare duplicateOf`)
  }
}

for (const entry of catalog.mappings) {
  if (entry.duplicateOf) check(entriesById.has(entry.duplicateOf), `${entry.id}: unknown duplicateOf ${entry.duplicateOf}`)
  if (entry.supersededBy) check(entriesById.has(entry.supersededBy), `${entry.id}: unknown supersededBy ${entry.supersededBy}`)
}

const traveler = readJson(entriesById.get('traveler-plugin').path)
const travelerControls = [...traveler.knobs, ...traveler.buttons]
const forbiddenTravelerParams = new Set([1, 4, 7, 20])
check(!travelerControls.some((control) => forbiddenTravelerParams.has(control.mappedParam)), 'traveler-plugin: rejected Wave/WT-bank identity present')
const selectorParams = new Set([0, 3, 6, 14, 31, 48, 84, 93, 102, 173, 178, 179, 181, 186])
check([...selectorParams].every((mappedParam) => traveler.knobs.some((control) => control.mappedParam === mappedParam)), 'traveler-plugin: selector missing from knobs')
check(!traveler.buttons.some((control) => selectorParams.has(control.mappedParam)), 'traveler-plugin: selector assigned to button')
check(traveler.buttons.every((control) => control.hapticMode === 1 && control.hapticSteps === 2), 'traveler-plugin: non-binary button')

for (const summary of summaries) console.log(`PASS ${summary}`)
console.log(`PASS catalog covers ${catalog.mappings.length} mappings; all validation checks succeeded`)
