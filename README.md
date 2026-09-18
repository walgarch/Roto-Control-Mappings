# Erae Sound mapping for Roto-Control

`Erae-Sound-Roto-Control.json` is a four-page Roto-Control MIDI Mode setup for the non-FX, live-performance controls of Embodme Erae Sound's two generators.

## Important limitation

Erae Sound does **not** document fixed MIDI CC or NRPN addresses for its synth parameters. Its MIDI reference only defines note velocity, release velocity, channel pressure, pitch bend, and CC 74 (MPE slide). Other CC sources are discovered from an active Erae hardware layout; they are not a general CC-to-parameter map.

Consequently, this file emits unique MIDI CC messages that must be bound to the named Erae Sound plug-in parameters in a DAW or plug-in host. It does not directly control Erae Sound when running inside Erae Lab. This avoids claiming unsupported CC/NRPN assignments.

## Encoder pages

All encoders use coarse 7-bit MIDI CC on channel 1. The DAW/host should scale `0..127` to the target parameter range shown below.

| Page | CCs (channel 1) | Encoders 1–8 | Erae Sound target ranges |
| --- | --- | --- | --- |
| 1 — Gen A performance | 1–8 | F1 Cut, F1 Res, F2 Cut, F2 Res, F1/F2, Level, Osc 1 Level, Osc 2 Level | Cut `0..143` MIDI note; all others `0.00..1.00` |
| 2 — Gen A colour | 17–24 | Osc 1 Shape, Osc 1 Fold, Osc 2 Shape, Osc 2 Fold, F1 Type, F2 Type, Noise, TZFM | All `0.00..1.00` |
| 3 — Gen B performance | 33–40 | Same as page 1 for Generator B | Same as page 1 |
| 4 — Gen B colour | 49–56 | Same as page 2 for Generator B | Same as page 2 |

Cutoff, resonance, filter balance, generator/oscillator levels, shape, fold, noise, and TZFM were selected because they provide the broadest real-time timbral and layer control. Coarse/fine tuning was omitted to reduce accidental pitch changes during performance. Filter poles and routing are exposed as buttons; voice and split configuration remain optional user assignments. FX were intentionally deprioritized.

Filter **Type** is continuous: `0.0` band-pass, `0.5` low-pass, and `1.0` high-pass. Oscillator **Shape** continuously morphs sine → triangle → pulse → saw.

The F1/F2 mix and both Filter Type encoders use Roto's centered/bipolar haptic mode, giving a tactile center at the equal mix or low-pass position. Other encoders remain smooth and continuous. This follows the convention observed in the supplied Traveler mapping and community exports; explicit indent-byte positions were avoided because their scaling is not documented.

## Buttons

Six buttons expose the documented non-modulatable generator choices. They use Roto's stepped/toggle haptic mode and concise state labels:

| Page | Buttons | CCs (channel 1) | States |
| --- | --- | --- | --- |
| 1 — Gen A performance | A F1 Poles, A F2 Poles, A Routing | 9–11 | `2 Pole` / `4 Pole`; `Serial` / `Parallel` / `Split` |
| 3 — Gen B performance | B F1 Poles, B F2 Poles, B Routing | 41–43 | Same for Generator B |

The host maps the buttons' normalized MIDI output to Erae's discrete automation parameters: a two-state button sends `0/127`, while a three-state button traverses the range in three steps. Do not interpret those CC values as literal Erae values `2/4`.

The other 26 buttons remain `USER` controls for optional host assignments. All now use unique channel-1 CCs, making the complete template a collision-free CC 1–64 map and avoiding the official helper's unusual CC 0/channel 9–16 first button bank. This also follows Erae Sound's DAW guidance: many hosts collapse non-MPE controller messages to channel 1.

## Setup

1. Install and open Melbourne Instruments **Roto-Setup**, connect Roto-Control over USB, and select **MIDI** mode.
2. On Roto-Control, select the MIDI Setup slot that may be overwritten.
3. In Roto-Setup choose **File → Import**, select `Erae-Sound-Roto-Control.json`, and confirm the overwrite. Use the arrow keys on Roto-Control to navigate the four pages.
4. Load Erae Sound as an instrument plug-in in a DAW/host and expose the listed plug-in parameters to host automation if the host requires that step.
5. Use the host's MIDI/controller-learn feature to bind each named incoming channel-1 CC to the same-named Erae Sound parameter. Bind the six named buttons to the corresponding discrete host parameters. Confirm the host scales `0..127` across the full target range rather than treating cutoff as a literal CC-sized `0..127` value.
6. Save the DAW/controller mapping with the project or as a host preset. Test minimum, midpoint, and maximum values before performing.

If the host cannot map incoming CC to plug-in automation parameters, use its macro/rack layer or controller-assignment facility. MPE expression remains separate: Erae Sound expects pitch bend, channel pressure, and CC 74 on MPE member channels 2–16; this template deliberately does not consume CC 74.

Motorized value feedback depends on the host returning matching MIDI CC values to Roto-Control. Erae Sound's documented host automation does not itself promise MIDI CC feedback, so motor recall may be unavailable or host-dependent.

## Sources and assumptions

Sources inspected on 18 September 2026:

- [Melbourne Instruments MIDI-HELPER JSON](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) — used as the structural and MIDI-address source of truth.
- [Roto-Control templates page](https://www.melbourneinstruments.com/roto-templates) and [Roto-Control user manual](https://www.melbourneinstruments.com/s/ROTO-UserManual-V1-1-4-April2025.pdf) — four pages, 32 knobs plus 32 buttons, MIDI Mode import, CC/NRPN, range, haptic, and step constraints.
- [Erae Sound Appendix A](https://embodme.com/manual/erae-sound#appendix-a-parameter-reference) — parameter names and ranges.
- [Erae Sound Appendix B](https://embodme.com/manual/erae-sound#appendix-b-midi-reference) — supported MIDI messages and MPE conventions.
- User-supplied `Traveler.json` plugin mapping — confirmed centered haptics, stepped buttons, fixed 16-entry step-name arrays, and the distinction between Roto `PLUGIN` and `MIDI` formats.
- [seee-m/Roto-Control-Templates](https://github.com/seee-m/Roto-Control-Templates), [rotocontrol-nickel's Digitone II MIDI setup](https://github.com/wyager/rotocontrol-nickel/blob/master/digitone2.json), and [TheGreatElemonade mappings](https://github.com/MrMatch246/RotoControlMappings/tree/main/TheGreatElemonade) — cross-checked sparse/paired controls, haptic modes, stepped state labels, ranges, indexing, and short hardware labels.

This is an initial, host-mediated mapping because no official Erae Sound CC/NRPN parameter table or MIDI-learn feature is documented. The template uses coarse 7-bit CCs; higher-resolution NRPN was not selected because Erae Sound publishes no NRPN addresses.

## Validation

From the repository root:

```sh
jq empty Erae-Sound-Roto-Control.json
```

The implementation was additionally checked for the official helper's object/field structure, 32 knobs and 32 buttons, sequential `0..31` indices, channel-1 CCs `1..64` with no collisions, legal 7-bit ranges, short labels, valid haptic combinations, and exactly 16 strings in every `stepNames` array. Intentional differences from the helper are the labels, centered encoder haptics, stepped named buttons, and normalized first button bank.
