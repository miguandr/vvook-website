# Fluid Design System — Mandatory Standard

This is not optional guidance. It exists because Session 10 (2026-11-09/10) lost roughly
four hours fighting a self-inflicted mess: a different `clamp()` derived by hand for every
single font-size, margin, and position, plus `position: absolute` used for a plain layout
relationship (centering a paragraph between two headings). Every element drifted out of
sync with every other element because nothing shared a common source of truth, and the
fix (`position: absolute` + manually-measured pixel offsets) fought the browser instead of
using it. **Every new page/section from here on follows this standard from the start.**

## The three layers

1. **Fluid tokens** — one shared type scale and one shared space scale, each token a single
   `clamp(min, fluid, max)` (or `max(min, fluid)` if deliberately uncapped — see below),
   defined once, referenced everywhere via `var()`. Never hand-derive a one-off `clamp()`
   for an individual element. If a new size is needed, add a new token to the scale.
2. **Normal-flow layout** — `flex`/`grid` with `gap`, not manually-placed children. Elements
   never overlap by accident because the browser is doing the stacking, not us.
3. **A handful of structural breakpoints** — 2–3 max, used only when the *layout itself*
   changes shape (columns collapse, a stack changes direction, a menu condenses). Sizes
   never jump at a breakpoint, because the tokens are already fluid across the whole range.

## Tokens

Reference range: **360px → 1440px** (phone to desktop), values in `rem` (not `px`) so
browser zoom / OS text-scaling still works for low-vision users.

```css
:root {
  /* type */
  --step--1: clamp(0.6875rem, 0.6667rem + 0.0926vw, 0.75rem); /* 11 → 12px */
  --step-0:  clamp(0.875rem,  0.8333rem + 0.1852vw, 1rem);    /* 14 → 16px */
  --step-1:  clamp(1.125rem,  1rem      + 0.5556vw, 1.5rem);  /* 18 → 24px */
  --step-2:  clamp(1.5rem,    1.1667rem + 1.4815vw, 2.5rem);  /* 24 → 40px */
  --step-3:  clamp(2.25rem,   1.3333rem + 4.0741vw, 5rem);    /* 36 → 80px */
  --display: clamp(4rem,     -0.6667rem + 20.7407vw, 18rem);  /* 64 → 288px */

  /* space */
  --space-s:  clamp(0.75rem, 0.6667rem + 0.3704vw, 1rem);   /* 12 → 16px */
  --space-m:  clamp(1.5rem,  1.1667rem + 1.4815vw, 2.5rem); /* 24 → 40px */
  --space-l:  clamp(3rem,    2rem      + 4.4444vw, 6rem);   /* 48 → 96px */
  --space-xl: clamp(5rem,    3.3333rem + 7.4074vw, 10rem);  /* 80 → 160px */
  --gutter:   clamp(1rem,    4.4444vw, 4rem);               /* 16 → 64px side padding */
}
```

Derive a new step the same way every time:

```
slope      = (maxPx − minPx) / (1440 − 360)
fluid part = slope × 100vw
intercept  = minPx − 360 × slope
```

(Or use [utopia.fyi](https://utopia.fyi) — a free tool built for exactly this.)

### No ceiling, on purpose

When a design should keep growing forever (edge-to-edge type, no boxed/centered layout past
some width), drop the max and use `max(minPx, fluid part)` instead of `clamp()`. Decided
explicitly in Session 10: we'd rather text stay proportional on a huge monitor than freeze
at a fixed pixel size and leave large dead margins. The floor still protects legibility on
small phones — only the ceiling is gone.

## Rules that stop things colliding

- **No `position: absolute` for layout.** Only for true decoration sitting on top of
  something else (a badge on a photo, an image deliberately overlapping a headline letter).
  A real layout relationship — "this sits between these two things," "these are evenly
  spaced" — is a flow problem. Use `gap`.
- **Siblings in one flex/grid parent, spaced with `gap`.** `gap` never collapses (unlike
  margin) and applies the *same* space between every pair of children automatically — so
  "center this between two things" is free: put all three in one `flex flex-col gap-[...]`
  container and it's centered by construction, no measuring required.
- `max-width` on body text (e.g. `max-w-[40ch]`) so lines never stretch edge to edge.
- `min-width: 0` on flex/grid children holding long text, or they overflow instead of
  shrinking (bit us hard on the model page's fan gallery in an earlier session).
- `aspect-ratio` on images/video so the page doesn't jump while they load.
- Avoid `vh` for spacing — mobile browser chrome (address bar) makes it unreliable. Use
  `svh`/`dvh` if screen height is genuinely needed.
- Tight `line-height` (~0.8–0.9) on big display type, so gaps are measured from the actual
  letters, not the font's built-in invisible space above/below them.
- **Test by dragging the window slowly through 360, 768, 1024, 1440, 1920, 2560px** — not
  by jumping straight to each one. A jump hides exactly the kind of discontinuity we spent
  Session 10 chasing.

## In Tailwind (v4)

Register tokens in `@theme` inside `globals.css` to get real utility classes:

```css
@theme {
  --font-size-step-1: var(--step-1);
  --spacing-gap-m: var(--space-m);
}
```

```tsx
<p className="text-step-1 gap-gap-m">...</p>
```

Until a token is registered, reference it directly with the `length:`/arbitrary-value hint:

```tsx
<p className="text-[length:var(--step-1)]">...</p>
<div className="flex flex-col gap-[var(--space-m)]">...</div>
```

## Anti-patterns from Session 10 — do not repeat

- A one-off `clamp()` hand-derived per element (font-size here, a different margin-top
  there, a different photo-position formula elsewhere) — nothing shared a source of truth,
  so nothing stayed in sync when any one piece changed.
- `position: absolute` to center a paragraph between two headings — fought margin collapse
  and flow cascading for hours; `gap` on a flex column solves this in one line, for free.
- Changing a `clamp()`'s min/max endpoints without recalculating the slope/intercept —
  the floor/ceiling silently stop matching the line in between.
- Measuring a "centered" position with `getBoundingClientRect()` while DevTools was eating
  into the real viewport width, or before the browser finished settling after a resize —
  always confirm a reading repeats before trusting it.
