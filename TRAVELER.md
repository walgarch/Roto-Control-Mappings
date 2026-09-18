# Traveler mappings for Roto-Control

Two Traveler setups are provided:

- `Traveler-Roto-Control.json` — the primary native Roto **PLUGIN** mapping. It uses Traveler's real plugin hash and exact host parameter identities from the expanded user export.
- `Traveler-Roto-Control-MIDI.json` — the earlier four-page **MIDI** fallback for hosts where native plugin recognition is unavailable. It requires Traveler MIDI Learn.

## Native PLUGIN mapping

The native file contains 63 unique encoder mappings and 25 useful button mappings across eight pages. Roto-Control can recognize Traveler by plugin hash `081a7b2c68303a52`, bind the exported host parameters directly, display their values, and use host feedback for motor recall.

| Page | Encoders (left to right) | Buttons |
| --- | --- | --- |
| 1 — Performance/Filter | Filter Cutoff, Resonance, Env Amount, HP Cutoff, Filter Spacing, Stereo Spread, Vintage, Master Volume | Filter Type, Filter Link, Bass Compensation |
| 2 — Oscillators 1/2 | Osc 1 Wave, Osc 1 Tune, Osc 2 Tune, Osc 2 Voices, Osc 2 Detune, Osc 2 Spread, FM Depth, Osc 3 Wave | Osc 1 Wave/Octave, Osc 2 Wave/Octave, and Osc 3 Wave |
| 3 — Oscillator 3/Voice | Osc 3 Tune, Osc 3 Detune, Osc 3 Spread, global Detune, Glide, Bend Down, Bend Up, LF Width | Osc 3 Octave under Osc 3 Tune |
| 4 — Envelopes | Filter Attack, Decay, Sustain, Release; Amp Attack, Decay, Sustain, Release | — |
| 5 — Modulation/Motion | Mod Env Attack, Decay, Sustain, Release; Velocity to Filter, Velocity to Amp, LFO 3 Rate, Stereo Panner | LFO 3 Waveform under LFO 3 Rate |
| 6 — LFO 1/2 | LFO 1 Rate, Fade, Pitch, Filter; LFO 2 Rate, Fade, Pitch, Filter | LFO 1 and LFO 2 Waveform under their Rate controls |
| 7 — Oscillator Mixer | Osc 1 Level/Pan, Osc 2 Level/Pan, Osc 3 Level/Pan, Noise Level, Feedback | Osc 1/2/3 Enable, Noise Enable, Noise Type |
| 8 — Output/Arp | Filter Drive, Filter Key Track, HP Env Amount, Master Trim, Master Pan, Arp Gate, Arp Swing | Limiter, Pan Random, Arp Enable/Latch/Mode/Octave/Rate/Destination |

Pages 1–3 prioritize controls useful while playing; pages 4–6 group sound design by function. Page 7 provides a complete oscillator mixer, while Page 8 combines the remaining output controls with the performance-oriented arpeggiator. Its seventh encoder slot is deliberately left empty rather than adding an unrelated or duplicate parameter. Knob and button arrays are independent: button slots are left empty when the export did not provide a musically appropriate button for that page.

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

Some selector metadata still needs clarification. The export reports eight unnamed steps for each oscillator waveform even though the guide describes a continuous four-landmark morph; zero steps for the six-value octave and Filter Type selectors; 12 raw numeric states for LFO 3 while the guide lists 21 waveforms; and no state names or counts for Arp Mode, Octave, Rate, or Destination. Noise Type is a two-state parameter, but its exported values (`1`, `0`) do not establish which is White and which is Pink, so the mapping preserves those values instead of guessing the labels. A fresh export after explicitly configuring those haptics in Roto-Setup, or screenshots of the host parameter value at each state, would establish the correct step counts and labels.

## MIDI fallback

Import `Traveler-Roto-Control-MIDI.json` into a MIDI setup slot if the host cannot use the native plugin template. Set Traveler to MIDI channel 1 or Omni, use its per-control **MIDI Learn**, then choose **Global MIDI CC** or **Settings → MIDI CC Assignments → Make Current Assignments Global**. The fallback sends unique channel-1 CCs 1–64 and deliberately leaves CC 74 free for MPE slide.

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
