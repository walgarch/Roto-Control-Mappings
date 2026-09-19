# Traveler mappings

Two current Roto-Control setups are available for Key Solutions Traveler:

- [`traveler.json`](../mappings/traveler/plugin/traveler.json) is the canonical native **PLUGIN** mapping.
- [`traveler-midi.json`](../mappings/traveler/midi/traveler-midi.json) is a four-page **MIDI** fallback that requires Traveler MIDI Learn.

Two unchanged historical native files remain in [`mappings/traveler/archive/`](../mappings/traveler/archive/) for provenance. They are not recommended for new imports.

## Canonical PLUGIN mapping

The canonical mapping uses Traveler plug-in hash `081a7b2c68303a52` and exact `(mappedParam, paramHash)` identities from the owner's supplied exports. It has 62 knobs and 29 genuine binary buttons. Empty slots are intentional where another control would weaken the page grouping.

| Page | Knobs, left to right | Buttons |
| --- | --- | --- |
| 1 — Performance | Voice Count, Glide, Detune, Bend Down/Up, Main Volume, Main Pan, Vintage | Limiter, Pan Random |
| 2 — Oscillator 1 + LFO 1 | Osc 1 Frequency, Octave, Level, Pan; LFO 1 Wave, Rate, Pitch, Filter | Osc 1 Enable; Sync/FM and Exp/Lin; LFO 1 Key Sync, Poly, Clock |
| 3 — Oscillator 2 + LFO 2 | Osc 2 Frequency, Octave, Voices, Detune, Level, Pan; LFO 2 Wave, Rate | Osc 2 Enable; LFO 2 Key Sync, Poly, Clock |
| 4 — Oscillator 3 + LFO 3 | Osc 3 Frequency, Octave, Detune, Spread, Level, Pan; LFO 3 Wave, Rate | Osc 3 Enable, 3KB, WT, 3LO, DUO; LFO 3 Key Sync, Poly, Clock |
| 5 — Arpeggiator | Direction, Range, Speed, Destination, Gate, Swing | Enable, Latch, Pedal, Mod Env |
| 6 — Filters | Type, Cutoff, Resonance, Spacing, Env Amount, Keyboard Amount, HP Cutoff, HP Env Amount | Filter Link, Bass Compensation |
| 7 — Filter/VCA envelopes | Filter A/D/S/R, VCA A/D/S/R | — |
| 8 — Noise/mixer + mod envelope | Noise Level/Type, Feedback, Drive, Mod A/D/S/R | Noise Enable |

Controls use normal capitalization while retaining established abbreviations. Each oscillator level is adjacent to its pan control. `Keyboard Amt` means the amount that low-pass cutoff follows keyboard pitch. Osc 2 Voices is the oscillator-unison selector with states 1–7; Performance Voice Count uses 1–8 and 16.

All multi-state dropdowns are stepped knobs, while buttons are binary toggles. Octave and Filter Type use six tactile steps, Arp Range four, Arp Speed sixteen, Arp Destination eleven, Arp Direction twenty, and LFO Wave twenty-one. PLUGIN files can name only 16 states: LFO states 17–21 and Arp Direction states 17–20 remain tactile and selectable but appear numerically on Roto-Control.

### Deliberate omissions

- Exported identities named `Osc 1/2/3 Wave` are absent. They were previously inferred as selectors, but the intended controls do not exist in that form.
- Filter Envelope Break and Sustain Level, VCA Alternate Control, MOD 1/2/3 routing, and arp Tempo are excluded by design.
- Duplicate `3 WT Bank` exports do not provide enough state evidence, so the ambiguous control remains omitted.
- Performance Mono/Legato/Poly and Osc 3 WT Position appear in the UI but have no supplied exported identity; none was invented.
- Page priorities omit Osc 2 Spread, FM Depth, filter/output Spread, LFO 1/2 Fade, LFO 2 Pitch/Filter, Filter/VCA Velocity, Amp/Master Trim, and LF Width.

### Glossary

- **3KB:** Oscillator 3 keyboard pitch tracking.
- **WT:** wavetable mode.
- **3LO:** Oscillator 3 LFO mode.
- **DUO:** adds a stacked oscillator voice to Oscillator 3.

### Import and test

1. Back up the current Roto-Control setup.
2. In Roto-Setup, import `mappings/traveler/plugin/traveler.json` as a **PLUGIN** template.
3. Load Traveler in the supported host used for the exports and confirm automatic recognition and motor recall.
4. Check page 1 performance controls, oscillator Level/Pan pairs on pages 2–4, all selector positions, and all 29 binary buttons.
5. Confirm the final five LFO Wave and final four Arp Direction states remain selectable even though their labels are numeric.
6. If a control resolves incorrectly, record its page, slot, Traveler version, and host.

Native identities can be version-sensitive. Uniquely named parameters may continue to resolve by hash after an update, while duplicate names can depend on the original index.

## MIDI fallback

Use `mappings/traveler/midi/traveler-midi.json` when native plug-in recognition is unavailable. Set Traveler to MIDI channel 1 or Omni, use per-control **MIDI Learn**, then make the current assignments global in Traveler. The mapping emits unique channel-1 CCs 1–64 and leaves CC 74 available for MPE slide.

The fallback's buttons contain only documented on/off targets. Multi-state choices formerly placed on buttons were removed in favor of genuine oscillator mode, arp-envelope, and Control Track toggles. These CCs are deliberate controller assignments, not claimed Traveler factory defaults.

## Colors

Traveler uses the shared functional palette: oscillator `17`, filter `64`, envelope `15`, modulation `16`, and mixer/output/arp/utility `70`. See [mapping conventions](mapping-conventions.md) for the visible color pairs and rationale.

## Sources and assumptions

- [Traveler User's Guide](https://www.keysolutionssounds.com/wp-content/uploads/Traveler_Users_Guide.pdf) — parameter names, states, MIDI Learn, global assignments, and channel setup.
- Owner-supplied native exports and UI screenshots — plug-in hash, exact parameter identities, page semantics, state order, and binary behavior.
- [Melbourne Instruments MIDI helper](https://www.melbourneinstruments.com/s/MIDI-HELPER.json) and Roto-Control manual — JSON format and controller constraints.
- Community Roto-Control templates — cross-checks for haptics, ranges, step arrays, and label length.

No native identity was invented. Run the repository checks in [validation.md](validation.md) before distribution.
