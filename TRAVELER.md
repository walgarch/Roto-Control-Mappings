# Traveler mappings for Roto-Control

Two Traveler setups are provided:

- `Traveler-Roto-Control.json` — the primary native Roto **PLUGIN** mapping. It uses Traveler's real plugin hash and exact host parameter identities from the expanded user export.
- `Traveler-Roto-Control-MIDI.json` — the earlier four-page **MIDI** fallback for hosts where native plugin recognition is unavailable. It requires Traveler MIDI Learn.

## Native PLUGIN mapping

The native file contains the full 64 encoder mappings and 10 true on/off button mappings across eight pages. Roto-Control can recognize Traveler by plugin hash `081a7b2c68303a52`, bind the exported host parameters directly, display their values, and use host feedback for motor recall.

| Page | Encoders (left to right) | Buttons |
| --- | --- | --- |
| 1 — Filters | Cutoff, Resonance, Env Amount, HP Cutoff, Spacing, Spread, Filter Type, Drive | Filter Link, Bass Compensation |
| 2 — Oscillators 1/2 | Osc 1 Wave/Tune/Octave; Osc 2 Wave/Tune/Octave/Voices/Detune | — |
| 3 — Oscillator 3/Voice | Osc 3 Wave, Tune, Octave, Detune, Spread; global Detune, Glide, Vintage | — |
| 4 — Envelopes | Filter Attack, Decay, Sustain, Release; Amp Attack, Decay, Sustain, Release | — |
| 5 — Modulation/LFO 3 | Mod Env Attack, Decay, Sustain, Release; Velocity to Filter/Amp; LFO 3 Wave/Rate | — |
| 6 — LFO 1/2 | Wave, Rate, Pitch and Filter depth for each LFO | — |
| 7 — Oscillator Mixer | Osc 1/2/3 Level and Pan; Noise Level and Type | Osc 1/2/3 Enable, Noise Enable |
| 8 — Arp/Output | Arp Mode, Range, Rate, Destination, Gate, Swing; Master Volume/Pan | Arp Enable/Latch, Limiter, Pan Random |

Every enumerated selector is now a stepped knob; buttons are reserved for genuine on/off parameters. Oscillator Wave remains a smooth knob because Traveler morphs continuously between waveform landmarks. LFO Wave uses 21 haptic steps (only the first 16 can be named by PLUGIN mode), while Filter Type, octave, voice-count, noise-type and arpeggiator choices use their documented counts. The 64-knob ceiling required omitting lower-priority controls including LFO fades, bend ranges, Filter Key Track, HP Env Amount, Master Trim, Feedback, Osc 2 Spread and LF Width.

### Color palette

The same functional palette is used throughout the project: oscillator **17** (black/yellow), filter **64** (white/navy), envelope **15** (black/orange), modulation **16** (black/brown), and mixer/output/arp/utility **70** (white/black). These five visible meanings are explicitly named in rotocontrol-nickel; undocumented IDs were removed rather than assigned guessed color names.

Two duplicate knob mappings and an accidental duplicate Amp Decay button from the capture were removed. Amp Release and Mod Envelope Attack were normalized to smooth continuous haptics to match the other envelope stages. Some exported step names remain blank because the host supplied a step count without readable state labels; these were not guessed.

### Import

1. Install Roto-Control's integration for your DAW using the current Melbourne Instruments Roto-Setup application.
2. Open Roto-Setup and import `Traveler-Roto-Control.json` as a **PLUGIN** template.
3. Load Traveler in the same supported host used to create the export (the parameter indices follow the host-visible Traveler parameter list).
4. Select the Traveler device and confirm that Roto-Control recalls the mapping and that the motors follow parameter values.
5. Test tuning, bipolar controls, waveform selectors, octaves, and the filter selector before using the template in a performance.

Native parameter mappings can be version-sensitive. If a future Traveler release changes its exposed parameter names or order, uniquely named parameters can still resolve by hash, while duplicate names may require the original index to remain stable.

## Missing or ambiguous captures

The expanded export resolves the mixer, drive/feedback, filter-link, bass-compensation, limiter, random-pan, oscillator-enable, and arpeggiator identities. It omits the previously captured Filter Cutoff identity, likely because the export reached its 64-encoder capacity; this essential control is retained from the prior export. LFO 3 Fade, Pitch, and Filter depth remain absent; they may not be host-exposed.

The supplied exports did not identify the normalized value ordering for Noise Type, so its two stepped positions are intentionally unnamed. PLUGIN mode can name only 16 of the documented 21 LFO waveforms and 20 arp modes; later positions remain numeric on hardware. A device test is still needed to confirm that Traveler's host-normalized selector order matches the manual's displayed order.

## MIDI fallback

Import `Traveler-Roto-Control-MIDI.json` into a MIDI setup slot if the host cannot use the native plugin template. Set Traveler to MIDI channel 1 or Omni, use its per-control **MIDI Learn**, then choose **Global MIDI CC** or **Settings → MIDI CC Assignments → Make Current Assignments Global**. The fallback sends unique channel-1 CCs 1–64 and deliberately leaves CC 74 free for MPE slide. Its buttons now contain only documented on/off targets; multi-state choices formerly placed on buttons (Filter Type, voice mode/count, oscillator octaves/voice count and Noise Type) were removed in favor of oscillator FM/low-mode, arp-envelope and Control Track toggles.

## Sources and assumptions

- [Traveler User's Guide](https://www.keysolutionssounds.com/wp-content/uploads/Traveler_Users_Guide.pdf) — parameter names, ranges, enumerated states, MIDI Learn, Global MIDI CC, and MIDI-channel setup.
- User-supplied `Traveler.json`, `Traveler-moreoptions.json`, and `Traveler-moreoptions2.json` exports — source of the exact plugin hash, host parameter indices, parameter hashes, ranges, and haptic settings; the controls were then regrouped into performance pages here.
- [Melbourne Instruments MIDI helper](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) and Roto-Control manual — MIDI JSON structure and control constraints.
- [Community Roto templates](https://github.com/seee-m/Roto-Control-Templates), [rotocontrol-nickel](https://github.com/wyager/rotocontrol-nickel), and [TheGreatElemonade mappings](https://github.com/MrMatch246/RotoControlMappings/tree/main/TheGreatElemonade) — cross-checked haptic modes, step labels, ranges, and hardware label length.

The native mapping contains only identities captured in the supplied export; no host parameter indices or hashes were invented. The fallback CC assignments are intentional controller assignments, not claimed Traveler factory defaults.

## Validation

```sh
jq empty Traveler-Roto-Control.json
jq empty Traveler-Roto-Control-MIDI.json
```

The native file is checked for the supplied PLUGIN schema, matching Traveler/plugin hashes, legal control indices and normalized ranges, valid parameter hashes, and exactly 16 strings in every `stepNames` array. The fallback retains the official MIDI-helper field structure, 32 knobs and 32 buttons, and unique channel-1 CCs 1–64.
