# Questory Flattened Hair Variants

Created for the private Questory family installation on 2026-07-27.

Four master illustrations come from the project-owned v1 complete avatar set:

- `smiley.png`
- `explorer.png`
- `star.png`
- `wizard.png`

The fifth master, `masters/boy-side-swept.png`, was generated for Questory as a
full-body edit of the Smiley base type and normalized to the same canvas and
ground line.

The reproducible script `scripts/generate-avatar-hair-variants.py` identifies
the hair pixels of each master inside reviewed geometry and writes six complete,
flattened WebP variants:

- red
- pink
- blue
- brown
- blonde
- black

No visual layers are composed in the browser. Every file remains a complete
`768 x 1152` full-body character. The exporter verifies that visible pixels
outside the reviewed hair mask remain unchanged.

The original v1 PNGs remain untouched and Git tag `avatar-complete-v1` marks the
production state before this pilot. The active catalog currently uses Smiley
and the side-swept style for boys, and Star, Explorer and Wizard for girls.
