# Erae Sound mappings

Two Roto-Control setups are available for Embodme Erae Sound:

- [`erae-sound.json`](../mappings/erae-sound/plugin/erae-sound.json) is a native **PLUGIN** candidate. It has exact host parameter identities but remains a candidate until its recognition, selector behavior, and motor recall are tested with hardware.
- [`erae-sound-midi.json`](../mappings/erae-sound/midi/erae-sound-midi.json) is a four-page **MIDI** fallback that requires controller assignment in a DAW or plug-in host.

## Native PLUGIN candidate

The native candidate uses plug-in hash `5d43192d07574151`, with 47 knobs and five buttons over six populated pages. It prioritizes both generators, their filters, output, the shared envelope, and LFO.

| Page | Knobs, left to right | Buttons |
| --- | --- | --- |
| 1 — Performance | A Mix, A1 Cutoff/Resonance/Fold; B Mix, B1 Cutoff/Resonance/Fold | A1 Poles, B1 Poles |
| 2 — Generator A | A1 Coarse/Fine/Shape/Level; A2 Coarse/Fine/Shape/Fold | A2 Poles |
| 3 — Generator B | B1 Coarse/Fine/Shape/Level; B2 Coarse/Fine/Shape/Fold | — |
| 4 — Mix/output | A2 Level, A TZFM, A Level/Pan; B2 Level, B TZFM, B Level/Pan | — |
| 5 — Filters/envelope | A1 Type, B1 Type; B2 Cutoff/Resonance/Type/Noise; Envelope Attack/Decay | B2 Poles |
| 6 — Envelope/LFO | Envelope Sustain/Release; LFO Rate/Wave/Skew/Phase/Offset | LFO Poly |

The candidate predates the repository-wide functional palette and retains exported color schemes `8`, `29`, `52`, and `60`. They are intentionally documented rather than rewritten: changing them would alter mapping semantics, and their visible meaning should be established on hardware before any separate palette-alignment change.

### Import and test

1. Back up the current Roto-Control setup.
2. In Roto-Setup, import `mappings/erae-sound/plugin/erae-sound.json` as a **PLUGIN** template.
3. Load Erae Sound in the host and confirm that Roto-Control recognizes plug-in hash `5d43192d07574151`.
4. Check each control against the page table, traverse every selector in both directions, and verify motor recall.
5. Record the Erae Sound version and host with any page/slot mismatch. Keep this mapping at candidate status until those checks pass.

## MIDI fallback

Erae Sound does **not** document fixed CC or NRPN addresses for its synth parameters. Its MIDI reference defines note velocity, release velocity, channel pressure, pitch bend, and CC 74 (MPE slide), but not a general CC-to-parameter map. The fallback therefore emits unique channel-1 CCs that must be learned or bound to same-named plug-in automation parameters in a host; it is not a factory Erae CC map and does not directly control Erae Sound inside Erae Lab.

| Page | Encoder CCs | Focus |
| --- | --- | --- |
| 1 | 1–8 | Generator A performance |
| 2 | 17–24 | Generator A color and selectors |
| 3 | 33–40 | Generator B performance |
| 4 | 49–56 | Generator B color and selectors |

Cutoff, resonance, filter balance, levels, shape, fold, filter type, poles, and routing were selected for live timbral control. The 32-knob MIDI limit omits Osc 2 Fold, Noise, TZFM, coarse/fine tuning, and FX. Filter poles and routing are stepped knobs, not buttons. The 32 buttons emit collision-free optional `USER` assignments; they do not claim Erae parameter identities.

To use the fallback:

1. Import `mappings/erae-sound/midi/erae-sound-midi.json` into a MIDI setup slot.
2. Load Erae Sound as a plug-in and expose automation parameters if the host requires it.
3. Bind each named channel-1 CC to the same-named parameter and let the host scale `0..127` across the target's full range.
4. Save the assignment in the host and test minimum, midpoint, and maximum values.

MPE expression remains separate: Erae Sound expects pitch bend, channel pressure, and CC 74 on member channels 2–16; the fallback leaves CC 74 unused. Motor feedback is host-dependent.

## Sources and assumptions

- [Erae Sound Appendix A](https://embodme.com/manual/erae-sound#appendix-a-parameter-reference) — parameter names and ranges.
- [Erae Sound Appendix B](https://embodme.com/manual/erae-sound#appendix-b-midi-reference) — supported MIDI messages and MPE conventions.
- [Melbourne Instruments MIDI helper](https://www.melbourneinstruments.com/s/MIDI-HELPER.json), templates page, and Roto-Control manual — JSON structure, mode, page, range, haptic, and step constraints.
- Supplied native exports and community mappings — exact native identities and cross-checks for haptics, steps, labels, and indexing.

No undocumented Erae CC or NRPN assignment is claimed. Run the repository checks in [validation.md](validation.md) before distributing either file.
