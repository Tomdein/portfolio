---
name: Hero Section
description: Full-viewport landing section with animated name and infoLine
targets:
  - ../src/components/Hero/Hero.tsx
  - ../src/components/Hero/Hero.module.scss
---

# Hero Section

The first screen visitors see. Occupies the full viewport height.

## Data

Loaded from `hero.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md)):

```yaml
title: "Ing."
firstName: "Tomas"
lastName: "Deingruber"
infoLine: "Ing. — MSc Computer Science"
```

- `infoLine` — subtitle shown below the name; supports Markdown formatting via showdown + DOMPurify; rendered via `mdToInlineHtml()` (outer `<p>` stripped to avoid nesting inside the existing `<p>` element)

## Layout

- Full viewport height (`100vh`)
- Name (title + firstName + lastName) and infoLine centered vertically and horizontally
- Minimal, clean design with generous whitespace

`[@test] ../src/components/Hero/Hero.test.tsx`

## Responsive Name Layout

Uses `pretext` (chenglou) to measure text width against available viewport width:

1. Try single line: `Title FirstName LastName`
2. If doesn't fit: two lines — `Title FirstName` / `LastName`
3. If `Title FirstName` overflows: three lines — `Title` / `FirstName` / `LastName`
4. If any single field still overflows at current font size: shrink all fields uniformly
5. Repeat shrinking until everything fits, with a minimum floor of **16px**

All name fields always share the same font size.

`[@test] ../src/components/Hero/Hero.responsive.test.tsx`

## GSAP Entrance Animation

Uses `useGSAP()` hook (not `useEffect`). On initial page load (not scroll-triggered):

1. Name text animates in — characters stagger into view (fade + translate from below) using `gsap.from()` on dynamically created `<span>` elements
2. InfoLine starts hidden via CSS (`opacity: 0`) and animates to visible using `gsap.to()` targeting `opacity: 1, y: 0` after the name animation completes
3. Total entrance animation duration: ~1.5–2 seconds
4. Animation uses GSAP `timeline` for sequencing

**Important:** Elements that start hidden must use CSS for the initial hidden state and `gsap.to()` to animate to the visible state. Do **not** use `gsap.from()` for elements with CSS-defined initial states — it causes race conditions where GSAP's inline styles conflict with CSS.

`[@test] ../src/components/Hero/Hero.animation.test.tsx`

## Loading Behavior (when loading screen is disabled)

- If `enableLoadingScreen: false` in `site.yaml`:
  - Hero name renders immediately with character stagger animation
  - Scrolling is locked until all YAML + images finish loading
  - Once loaded: infoLine animates in, scrolling unlocks

## Scroll Behavior

- As the user scrolls past the hero, content fades out with a parallax-like upward drift
- Implemented via GSAP ScrollTrigger pinning or fade effect

## Styling

- Font: large, bold for name; lighter weight for infoLine
- Dark background consistent with site theme
- Responsive: name scales and wraps per the responsive layout algorithm above
