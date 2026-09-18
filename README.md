# Erae Sound mapping for Roto-Control

`Erae-Sound-Roto-Control.json` is a four-page Roto-Control MIDI Mode setup for the non-FX, live-performance controls of Embodme Erae Sound's two generators.

## Important limitation

Erae Sound does **not** document fixed MIDI CC or NRPN addresses for its synth parameters. Its MIDI reference only defines note velocity, release velocity, channel pressure, pitch bend, and CC 74 (MPE slide). Other CC sources are discovered from an active Erae hardware layout; they are not a general CC-to-parameter map.

Consequently, this file emits unique MIDI CC messages that must be bound to the named Erae Sound plug-in parameters in a DAW or plug-in host. It does not directly control Erae Sound when running inside Erae Lab. This avoids claiming unsupported CC/NRPN assignments.

## Encoder pages

All encoders preserve the helper template's MIDI channel, CC number, 7-bit range (`0..127`), and continuous-knob settings. The DAW/host should scale that normalized range to the target parameter range shown below.

| Page | CCs (channel 1) | Encoders 1–8 | Erae Sound target ranges |
| --- | --- | --- | --- |
| 1 — Gen A performance | 1–8 | F1 Cut, F1 Res, F2 Cut, F2 Res, F1/F2, Level, Osc 1 Level, Osc 2 Level | Cut `0..143` MIDI note; all others `0.00..1.00` |
| 2 — Gen A colour | 17–24 | Osc 1 Shape, Osc 1 Fold, Osc 2 Shape, Osc 2 Fold, F1 Type, F2 Type, Noise, TZFM | All `0.00..1.00` |
| 3 — Gen B performance | 33–40 | Same as page 1 for Generator B | Same as page 1 |
| 4 — Gen B colour | 49–56 | Same as page 2 for Generator B | Same as page 2 |

Cutoff, resonance, filter balance, generator/oscillator levels, shape, fold, noise, and TZFM were selected because they provide the broadest real-time timbral and layer control. Coarse/fine tuning was omitted to reduce accidental pitch changes during performance. Voice configuration, split settings, filter poles, and routing were omitted because they are discrete setup choices rather than continuous performance controls. FX were intentionally deprioritized.

Filter **Type** is continuous: `0.0` band-pass, `0.5` low-pass, and `1.0` high-pass. Oscillator **Shape** continuously morphs sine → triangle → pulse → saw.

## Buttons

The 32 button records and their original MIDI addresses are retained so the file matches the supplied 32-knob/32-button format, but they are labelled `USER A1..A16` and `USER B1..B16` and have no claimed Erae Sound destination. Erae Sound publishes no direct MIDI messages for routing, poles, retrigger, split mode, or FX bypass. Assign these in the host if desired.

The downloaded helper has an unusual but intentional-looking first button bank: buttons 1–8 send CC 0 on channels 9–16. Remaining buttons send channel-1 CCs 25–32, 41–48, and 57–64. These values were preserved exactly rather than replaced with possibly reserved Roto-Control CCs.

## Setup

1. Install and open Melbourne Instruments **Roto-Setup**, connect Roto-Control over USB, and select **MIDI** mode.
2. On Roto-Control, select the MIDI Setup slot that may be overwritten.
3. In Roto-Setup choose **File → Import**, select `Erae-Sound-Roto-Control.json`, and confirm the overwrite. Use the arrow keys on Roto-Control to navigate the four pages.
4. Load Erae Sound as an instrument plug-in in a DAW/host and expose the listed plug-in parameters to host automation if the host requires that step.
5. Use the host's MIDI/controller-learn feature to bind each incoming channel-1 CC to the same-named Erae Sound parameter. Confirm the host scales `0..127` across the full target range rather than treating cutoff as a literal CC-sized `0..127` value.
6. Save the DAW/controller mapping with the project or as a host preset. Test minimum, midpoint, and maximum values before performing.

If the host cannot map incoming CC to plug-in automation parameters, use its macro/rack layer or controller-assignment facility. MPE expression remains separate: Erae Sound expects pitch bend, channel pressure, and CC 74 on MPE member channels 2–16; this template deliberately does not consume CC 74.

Motorized value feedback depends on the host returning matching MIDI CC values to Roto-Control. Erae Sound's documented host automation does not itself promise MIDI CC feedback, so motor recall may be unavailable or host-dependent.

## Sources and assumptions

Sources inspected on 18 September 2026:

- [Melbourne Instruments MIDI-HELPER JSON](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) — used as the structural and MIDI-address source of truth.
- [Roto-Control templates page](https://www.melbourneinstruments.com/roto-templates) and [Roto-Control user manual](https://www.melbourneinstruments.com/s/ROTO-UserManual-V1-1-4-April2025.pdf) — four pages, 32 knobs plus 32 buttons, MIDI Mode import, CC/NRPN, range, haptic, and step constraints.
- [Erae Sound Appendix A](https://embodme.com/manual/erae-sound#appendix-a-parameter-reference) — parameter names and ranges.
- [Erae Sound Appendix B](https://embodme.com/manual/erae-sound#appendix-b-midi-reference) — supported MIDI messages and MPE conventions.

This is an initial, host-mediated mapping because no official Erae Sound CC/NRPN parameter table or MIDI-learn feature is documented. The template uses coarse 7-bit CCs; higher-resolution NRPN was not selected because Erae Sound publishes no NRPN addresses.

## Validation

From the repository root:

```sh
jq empty Erae-Sound-Roto-Control.json
```

The implementation was additionally checked against the downloaded helper to ensure identical object keys, control indices, MIDI modes, channels, CCs, ranges, haptic settings, colours, and step-array lengths; only the setup and control labels differ.
