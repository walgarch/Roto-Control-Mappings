# Validation

Run all repository checks from the root:

```sh
node scripts/validate-mappings.mjs
jq empty catalog.json $(find mappings -name '*.json' -type f -print)
git diff --check
```

The Node.js validator has no package dependencies. It treats `catalog.json` as the list of distributable and archived mappings.

## Automated checks

- Every mapping below `mappings/` is cataloged, and every catalog path exists.
- PLUGIN and MIDI root/control field sets match their exported formats.
- Mode, plug-in hash or MIDI setup index, ranges, indices, and per-page capacities are legal.
- Labels fit the 12-byte hardware limit.
- `stepNames` contains exactly 16 strings and haptic step counts fit the mode.
- PLUGIN parameter identities and MIDI addresses are unique within each mapping.
- Mapping colors are declared in the catalog.
- Reserved MIDI CCs are not consumed where declared.
- Duplicate active files are rejected unless an archive entry explicitly declares `duplicateOf`.
- Canonical Traveler invariants exclude rejected legacy Wave/WT-bank identities, keep known selectors on knobs, and keep buttons binary.

## Manual checks

Automation cannot establish that a host or plug-in interprets an exported parameter in the expected order. Before promoting a candidate:

1. Import it with the current Roto-Setup release.
2. Confirm plug-in recognition and motor recall.
3. Exercise minimum, midpoint, and maximum for continuous controls.
4. Traverse every selector state in both directions.
5. Verify each button is genuinely binary.
6. Record the plug-in version, host, and any mismatched page/slot.

## Organizational changes

When moving mappings, record SHA-256 hashes before and after. Mapping hashes must remain identical so organizational pull requests contain rename-only mapping changes. Semantic mapping changes belong in separate commits and reviews.
