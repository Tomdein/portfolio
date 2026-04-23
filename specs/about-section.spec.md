---
name: About Section
description: Short about-me section with scroll-triggered text reveal and exit
targets:
  - ../src/components/About/About.tsx
  - ../src/components/About/About.module.scss
---

# About Section

A brief, visually engaging introduction that appears below the tagline section.

## Content

- Short paragraph (2-4 sentences) about the person
- Text loaded from `about.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md))
- No photo or avatar — text only for clean minimalism
- Text supports Markdown formatting (bold, italic, links, etc.) via showdown + DOMPurify

`[@test] ../src/components/About/About.test.tsx`

## GSAP Scroll Animation

Uses `useGSAP()` hook (not `useEffect`).

### Word Splitting

- Markdown HTML is injected into a `<div ref={textRef}>` via `useLayoutEffect` using `mdToHtml()`
- After injection, `wrapTextWords()` walks all text nodes in the container and wraps each word in `<span class=word><span class=wordInner>word</span></span>`
- `useLayoutEffect` is declared **before** `useGSAP` so word spans exist when GSAP queries them (both run as layout effects in declaration order)

### Entrance & Exit (single combined animation)

- Initial hidden state is set via CSS on `.wordInner` (`opacity: 0; y: 20`) — not via `gsap.from()`
- A single `gsap.to()` with **keyframes** drives both entrance and exit in one ScrollTrigger pass:
  - `0%` → `{y: 20, opacity: 0}` (hidden, starting state)
  - `15%` → `{y: 0, opacity: 1}` (fully visible)
  - `85%` → `{y: 0, opacity: 1}` (holds visible)
  - `100%` → `{y: 20, opacity: 0}` (fades out upward)
  - `easeEach: 'sine.out'` per keyframe step; `ease: 'none'` on the outer block
- ScrollTrigger: `trigger: section`, `start: 'top 60%'`, `end: 'bottom 40%'`, `scrub: true`, `toggleActions: 'play complete none reverse'`
- `stagger: 0.015` across all word spans

`[@test] ../src/components/About/About.animation.test.tsx`

## Styling

- Centered text, max-width container (~700–800px)
- Larger-than-body font size for emphasis
- Section `min-height: 120vh` to give scroll room for the combined entrance/exit keyframe sequence
- Bigger vertical spacing after the about section (before projects)
