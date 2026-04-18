---
name: About Section
description: Short about-me section with scroll-triggered text reveal
targets:
  - ../src/components/About/About.tsx
  - ../src/components/About/About.module.scss
---

# About Section

A brief, visually engaging introduction that appears below the hero.

## Content

- Short paragraph (2-4 sentences) about the person
- Text loaded from `about.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md))
- No photo or avatar — text only for clean minimalism

`[@test] ../src/components/About/About.test.tsx`

## GSAP Scroll Animation

- Text reveals on scroll using ScrollTrigger
- Words animate in sequentially (staggered fade + slight upward translate via `gsap.from()` on inner word spans)
- ScrollTrigger range: `start: "top 70%"`, `end: "top -10%"` — gives a longer scroll distance for the reveal to complete
- scrub: smooth tie to scroll position for fluid feel

`[@test] ../src/components/About/About.animation.test.tsx`

## Styling

- Centered text, max-width container (~700–800px)
- Larger-than-body font size for emphasis
- Adequate vertical padding to separate from hero and projects sections
