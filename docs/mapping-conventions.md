# Mapping conventions

These conventions describe repository organization and validated Roto-Control constraints. Instrument-specific evidence and intentional exceptions belong in the product documentation and `catalog.json`.

## Files and status

- Distributable mappings live below `mappings/<product>/<mode>/`.
- Canonical filenames use lowercase kebab case and do not repeat the repository or controller name.
- Historical mappings live below a product's `archive/` directory and remain byte-preserved.
- Every mapping is listed in `catalog.json` as `canonical`, `candidate`, `fallback`, or `archive`.

## Controls and pages

- PLUGIN templates can address up to 64 knobs and 64 buttons over eight pages.
- MIDI templates can address up to 32 knobs and 32 buttons over four pages.
- Each surface has at most eight controls per page. Knob and button indices are independent.
- Continuous parameters and multi-state selectors belong on knobs.
- Buttons are for genuine binary controls unless authoritative instrument evidence requires an explicitly documented exception.
- It is preferable to leave a slot unused rather than add an unrelated or unsupported control.

## Labels and steps

- Hardware labels are at most 12 UTF-8 bytes.
- Labels use normal capitalization while preserving established acronyms such as LFO, HP, FM, WT, and MIDI.
- Every `stepNames` array contains exactly 16 strings.
- PLUGIN knobs may have up to 24 tactile steps, but only the first 16 can be named.
- MIDI knobs may have up to 16 tactile steps.
- State order comes from authoritative UI, manual, or exported evidence; unknown state names are not guessed.

## Identities and ranges

- Native mappings retain exact exported `(mappedParam, paramHash)` identities and plug-in hashes.
- PLUGIN knobs use Roto's `0..16383` control range; PLUGIN buttons use `0..127`.
- MIDI mappings declare channel, CC/NRPN mode, address, and `0..127` range explicitly.
- A host-mediated MIDI fallback does not imply that the instrument has factory CC assignments.

## Functional colors

Traveler and the Erae MIDI fallback use the documented project palette:

| Function | Scheme | Visible colors |
| --- | ---: | --- |
| Oscillator | 17 | black/yellow |
| Filter | 64 | white/navy |
| Envelope | 15 | black/orange |
| Modulation | 16 | black/brown |
| Mixer/output/arp/utility | 70 | white/black |

The native Erae Sound candidate predates this palette and uses exported schemes `8`, `29`, `52`, and `60`. Those values are preserved pending hardware testing; palette alignment would be a semantic mapping change and requires separate approval.
