---
name: Hero Section
description: Full-viewport landing section with animated name and tagline
targets:
  - ../src/components/Hero/Hero.tsx
  - ../src/components/Hero/Hero.module.scss
---

# Hero Section

The first screen visitors see. Occupies the full viewport height.

## Layout

- Full viewport height (`100vh`)
- Name and tagline centered vertically and horizontally
- Name: **Tomas Deingruber**
- Tagline: **A Maker, Programmer and Mathematician**
- Minimal, clean design with generous whitespace

`[@test] ../src/components/Hero/Hero.test.tsx`

## GSAP Entrance Animation

On initial page load (not scroll-triggered):

1. Name text animates in — characters stagger into view (fade + translate from below) using `gsap.from()` on dynamically created `<span>` elements
2. Tagline starts hidden via CSS (`opacity: 0`) and animates to visible using `gsap.to()` targeting `opacity: 1, y: 0` after the name animation completes
3. Total entrance animation duration: ~1.5–2 seconds
4. Animation uses GSAP `timeline` for sequencing

**Important:** Elements that start hidden must use CSS for the initial hidden state and `gsap.to()` to animate to the visible state. Do **not** use `gsap.from()` for elements with CSS-defined initial states — it causes race conditions where GSAP's inline styles conflict with CSS.

`[@test] ../src/components/Hero/Hero.animation.test.tsx`

## Scroll Behavior

- As the user scrolls past the hero, content fades out with a parallax-like upward drift
- Implemented via GSAP ScrollTrigger pinning or fade effect

## Styling

- Font: large, bold for name; lighter weight for tagline
- Dark background consistent with site theme
- Responsive: scales appropriately on mobile
