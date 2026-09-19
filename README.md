# Roto-Control Mappings

Mapping files for [Melbourne Instruments Roto-Control](https://www.melbourneinstruments.com/rotocontrol).

This repository contains native PLUGIN templates and MIDI-mode fallbacks. Import the mapping appropriate for the instrument and host; archived files remain available for provenance but are not recommended for new setups.

## Supported mappings

| Instrument | Mode | Status | Mapping | Documentation |
| --- | --- | --- | --- | --- |
| Embodme Erae Sound | PLUGIN | Candidate — hardware testing pending | [`erae-sound.json`](mappings/erae-sound/plugin/erae-sound.json) | [Erae Sound](docs/erae-sound.md) |
| Embodme Erae Sound | MIDI | Fallback — requires host MIDI Learn | [`erae-sound-midi.json`](mappings/erae-sound/midi/erae-sound-midi.json) | [Erae Sound](docs/erae-sound.md) |
| Key Solutions Traveler | PLUGIN | Canonical | [`traveler.json`](mappings/traveler/plugin/traveler.json) | [Traveler](docs/traveler.md) |
| Key Solutions Traveler | MIDI | Fallback — requires Traveler MIDI Learn | [`traveler-midi.json`](mappings/traveler/midi/traveler-midi.json) | [Traveler](docs/traveler.md) |

Historical Traveler templates are retained under [`mappings/traveler/archive/`](mappings/traveler/archive/) and cataloged in [`catalog.json`](catalog.json).

## Import

1. Back up the current Roto-Control setup.
2. Open Melbourne Instruments Roto-Setup.
3. Import the selected JSON in the matching **PLUGIN** or **MIDI** mode.
4. Follow the instrument-specific setup and verification steps linked above.

Native templates can depend on a plug-in version's host-visible parameter identities. MIDI fallbacks send controller messages and require assignment in the plug-in or host; they are not claims of factory CC assignments.

## Validation

Run the dependency-free validator with Node.js:

```sh
node scripts/validate-mappings.mjs
```

See [validation](docs/validation.md) for the complete checks and release process, and [mapping conventions](docs/mapping-conventions.md) for naming, controls, haptics, and colors.

## Status definitions

- **Canonical:** recommended mapping for normal use.
- **Candidate:** structurally validated but awaiting stated hardware or host confirmation.
- **Fallback:** supported alternate mode that requires manual MIDI assignment.
- **Archive:** retained unchanged for history and comparison; not recommended for new imports.

## License and independence

This is an independent community project, not an official vendor repository. See the [project notice](NOTICE.md) for compatibility, trademark, and provenance information. Original contributions are available under the [MIT License](LICENSE).
