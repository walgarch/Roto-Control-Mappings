# Traveler mapping for Roto-Control

`Traveler-Roto-Control.json` is a four-page Roto-Control MIDI setup for the KeySolutions Sounds Traveler software synthesizer. It prioritizes synthesis and live performance over effects, deep modulation-matrix editing, and sequencing.

## Why this is a MIDI setup

The supplied `Traveler.json` is a valid native Roto `PLUGIN` mapping, but contains only four encoders and three buttons. A native mapping requires Traveler's exact host parameter index and a hash derived from the host's exact parameter name. The seven supplied records verify that format, but Traveler's guide does not publish the complete host parameter list, so inventing the remaining identities would produce an unreliable file.

Traveler instead documents per-control **MIDI Learn** and persistent **Global MIDI CC** assignments. This setup therefore uses coarse 7-bit CC on channel 1 and can be completely configured from Traveler itself.

## Pages

| Page | Encoders (left to right) | Buttons (left to right) | CCs |
| --- | --- | --- | --- |
| 1 — Performance | Filter Cutoff, Resonance, Env Amount, HP Cutoff, Drive, Feedback, Pan Spread, Vintage | Filter Type, Bass Compensation, HP Link, Voice Mode, Voices, Limiter, Random Pan, Arp On | Knobs 1–8; buttons 9–16 |
| 2 — Oscillators | Osc 1/2/3 Wave, Osc 1/2/3 Level, Noise Level, Osc 2 Detune | Osc 1/2/3 Octave, Osc Sync, Osc 2 Voices, Osc 3 WT, Duo, Key Track | Knobs 17–24; buttons 25–32 |
| 3 — Envelopes | Filter ADSR, Amp ADSR | Osc 1/2/3 Mute, Noise Type, Retrigger, Arp Latch, Arp Pedal, Mod Alt Control | Knobs 33–40; buttons 41–48 |
| 4 — Motion | LFO 1 Rate, Filter, Pitch, Fade, Filter Spacing, Filter Spread, Glide, LF Width | LFO 1 Key Sync/Poly/Clock, LFO 2 Key Sync/Poly/Clock, LFO 3 Key Sync/Clock | Knobs 49–56; buttons 57–64 |

Filter Env Amount and Filter Spacing are bipolar and use Roto's centered haptic mode. Continuous parameters use smooth encoders. Enumerated parameters use stepped buttons with the exact states documented by Traveler, including six filter models, six oscillator octaves, 1–7 Oscillator 2 voices, and 1–16 performance voices.

## Import and MIDI Learn

1. Open Melbourne Instruments **Roto-Setup**, select a MIDI setup slot, then choose **File → Import** and import `Traveler-Roto-Control.json`.
2. In Traveler, set **Settings → MIDI Channel** to `Channel 1` or `Omni`.
3. For each desired mapping, Control-click/right-click the Traveler control, choose **MIDI Learn**, then move or press the same-named Roto control.
4. Control-click/right-click the Traveler control again and choose **Global MIDI CC**. Alternatively, after learning the controls, use **Settings → MIDI CC Assignments → Make Current Assignments Global**.
5. Test every stepped control through all states. If Traveler interprets a toggle in the opposite direction, reverse that assignment in Roto-Setup or relearn it as appropriate.

The MIDI setup sends CC 1–64 on channel 1 with no collisions. CC 74 is deliberately unused so it remains available for MPE slide. Motorized value feedback depends on Traveler or the host returning matching MIDI CC messages; the Traveler guide documents MIDI input learning but does not promise controller feedback.

## Mapping choices and omissions

Page 1 contains the controls most likely to shape a sound during performance. Page 2 covers oscillator timbre and layer balance. Page 3 makes articulation and source muting readily available. Page 4 covers movement and stereo width.

Effects were omitted to keep the setup synthesis-focused. Oscillator tuning was omitted to prevent accidental pitch changes. The 21-slot modulation matrix, control-track steps, wavetable selection, and arpeggiator direction/speed offer more choices than a concise four-page performance layout can expose; they remain available in Traveler or can replace less useful controls in Roto-Setup.

## Sources and assumptions

- [Traveler User's Guide](https://www.keysolutionssounds.com/wp-content/uploads/Traveler_Users_Guide.pdf) — parameter names, ranges, enumerated states, MIDI Learn, Global MIDI CC, and MIDI-channel setup.
- User-supplied `Traveler.json` — verified Roto plugin structure and existing Traveler identities, plus centered and stepped haptic conventions.
- [Melbourne Instruments MIDI helper](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) and Roto-Control manual — MIDI JSON structure and control constraints.
- [Community Roto templates](https://github.com/seee-m/Roto-Control-Templates), [rotocontrol-nickel](https://github.com/wyager/rotocontrol-nickel), and [TheGreatElemonade mappings](https://github.com/MrMatch246/RotoControlMappings/tree/main/TheGreatElemonade) — cross-checked haptic modes, step labels, ranges, and hardware label length.

Traveler's guide describes MIDI Learn but does not publish factory CC assignments, NRPN addresses, or the complete native host parameter order. The CC assignments in this file are therefore an intentional controller layout, not claimed Traveler defaults.

## Validation

```sh
jq empty Traveler-Roto-Control.json
```

The file is also checked for the official MIDI-helper field structure, 32 knobs and 32 buttons, sequential indices, unique channel-1 CCs 1–64, legal 7-bit ranges, hardware-sized labels, valid haptic combinations, and exactly 16 strings in every `stepNames` array.
