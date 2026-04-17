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

1. Name text animates in — characters or words stagger into view (e.g., fade + translate from below)
2. Tagline fades in after the name animation completes
3. Total entrance animation duration: ~1.5–2 seconds
4. Animation uses GSAP `timeline` for sequencing

`[@test] ../src/components/Hero/Hero.animation.test.tsx`

## Scroll Behavior

- As the user scrolls past the hero, content fades out with a parallax-like upward drift
- Implemented via GSAP ScrollTrigger pinning or fade effect

## Styling

- Font: large, bold for name; lighter weight for tagline
- Dark background consistent with site theme
- Responsive: scales appropriately on mobile
