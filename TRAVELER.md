# Traveler mappings for Roto-Control

Two Traveler setups are provided:

- `Traveler-Roto-Control.json` — the primary native Roto **PLUGIN** mapping. It uses Traveler's real plugin hash and exact host parameter identities from the expanded user export.
- `Traveler-Roto-Control-MIDI.json` — the earlier four-page **MIDI** fallback for hosts where native plugin recognition is unavailable. It requires Traveler MIDI Learn.

## Native PLUGIN mapping

The native file contains 54 encoder mappings and 11 button mappings across seven pages. Roto-Control can recognize Traveler by plugin hash `081a7b2c68303a52`, bind the exported host parameters directly, display their values, and use host feedback for motor recall.

| Page | Encoder focus | Buttons |
| --- | --- | --- |
| 1 | Filter cutoff; Osc 1–3 tuning; LFO 1 rate, fade, pitch, and filter depth | LFO 1 waveform; Osc 1–3 waveform selectors; LFO 2 waveform; Osc 1–3 octave |
| 2 | LFO 2 rate, fade, pitch, and filter depth; Osc 1 wave/tune; FM depth; Osc 2 voices | Filter Type at the first slot |
| 3 | Osc 2 detune/spread; Osc 3 tune, wave, detune, and spread; filter resonance and spacing | — |
| 4 | Filter envelope amount, key tracking, HP cutoff/envelope amount; stereo spread; master trim, volume, and pan | — |
| 5 | Stereo panner, LF width, Vintage, Glide, global Detune, pitch-bend ranges, LFO 3 rate | LFO 3 waveform; Amp Decay |
| 6 | Filter ADSR, velocity-to-filter, and Amp attack/decay/sustain | — |
| 7 | Amp release, velocity-to-amp, and Mod Envelope ADSR | — |

The layout intentionally preserves the expanded export's page positions, haptic configuration, ranges, labels, and any duplicate convenience mappings. Some exported step names are blank because the host supplied a step count without readable state labels; these were not guessed.

### Import

1. Install Roto-Control's integration for your DAW using the current Melbourne Instruments Roto-Setup application.
2. Open Roto-Setup and import `Traveler-Roto-Control.json` as a **PLUGIN** template.
3. Load Traveler in the same supported host used to create the export (the parameter indices follow the host-visible Traveler parameter list).
4. Select the Traveler device and confirm that Roto-Control recalls the mapping and that the motors follow parameter values.
5. Test tuning, bipolar controls, waveform selectors, octaves, and the filter selector before using the template in a performance.

Native parameter mappings can be version-sensitive. If a future Traveler release changes its exposed parameter names or order, uniquely named parameters can still resolve by hash, while duplicate names may require the original index to remain stable.

## MIDI fallback

Import `Traveler-Roto-Control-MIDI.json` into a MIDI setup slot if the host cannot use the native plugin template. Set Traveler to MIDI channel 1 or Omni, use its per-control **MIDI Learn**, then choose **Global MIDI CC** or **Settings → MIDI CC Assignments → Make Current Assignments Global**. The fallback sends unique channel-1 CCs 1–64 and deliberately leaves CC 74 free for MPE slide.

## Sources and assumptions

- [Traveler User's Guide](https://www.keysolutionssounds.com/wp-content/uploads/Traveler_Users_Guide.pdf) — parameter names, ranges, enumerated states, MIDI Learn, Global MIDI CC, and MIDI-channel setup.
- User-supplied `Traveler.json` and expanded `Traveler-moreoptions.json` exports — source of the exact plugin hash, host parameter indices, parameter hashes, page positions, ranges, and haptic settings.
- [Melbourne Instruments MIDI helper](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) and Roto-Control manual — MIDI JSON structure and control constraints.
- [Community Roto templates](https://github.com/seee-m/Roto-Control-Templates), [rotocontrol-nickel](https://github.com/wyager/rotocontrol-nickel), and [TheGreatElemonade mappings](https://github.com/MrMatch246/RotoControlMappings/tree/main/TheGreatElemonade) — cross-checked haptic modes, step labels, ranges, and hardware label length.

The native mapping contains only identities captured in the supplied export; no host parameter indices or hashes were invented. The fallback CC assignments are intentional controller assignments, not claimed Traveler factory defaults.

## Validation

```sh
jq empty Traveler-Roto-Control.json
jq empty Traveler-Roto-Control-MIDI.json
```

The native file is checked for the supplied PLUGIN schema, matching Traveler/plugin hashes, legal control indices and normalized ranges, valid parameter hashes, and exactly 16 strings in every `stepNames` array. The fallback retains the official MIDI-helper field structure, 32 knobs and 32 buttons, and unique channel-1 CCs 1–64.
