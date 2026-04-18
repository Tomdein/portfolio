---
name: Projects Section
description: Scrollable list of projects driven by YAML config
targets:
  - ../src/components/Projects/Projects.tsx
  - ../src/components/Projects/Projects.module.scss
  - ../src/components/Projects/ProjectCard.tsx
  - ../src/components/Projects/ProjectCard.module.scss
---

# Projects Section

A vertically scrollable list of project cards. Content is driven by `projects.yaml` (see [yaml-config spec](yaml-config.spec.md)).

## Data Loading

- Project data loaded at runtime from `projects.yaml` via the shared YAML config loader
- Projects are sorted by `order` field (ascending)
- `js-yaml` parses the YAML in the browser

`[@test] ../src/components/Projects/Projects.test.tsx`

### Required Fields

- `title` — project name
- `description` — short summary (shown on card)
- `tags` — array of technology/skill tags
- `image` — path to project screenshot/image (relative to `public/`)
- `order` — numeric sort order (ascending)

### Optional Fields

- `link` — URL to project repo or live demo
- Markdown body — extended description (reserved for future detail view)

## Project Card

Each card displays:

- Project image (left or alternating left/right)
- Title
- Description text
- Tag pills/chips
- Optional external link icon/button

`[@test] ../src/components/Projects/ProjectCard.test.tsx`

## GSAP Scroll Animations

### Card Entrance & Exit

- Each project card starts hidden via CSS (`opacity: 0; transform: translateY(60px)`)
- Uses `gsap.to()` with **keyframes** and `scrub: 0.5` for scroll-linked animation:
  - Enters: translates to `y: 0, opacity: 1` (ease: `sine.in`)
  - Holds visible through mid-scroll
  - Exits: translates to `y: -20, opacity: 0` (ease: `sine.out`)
- ScrollTrigger range: `start: "top 70%"`, `end: "bottom 40%"`, `toggleActions: "play complete none reverse"`, `fastScrollEnd: true`

**Important:** Card entrance animations must use CSS for the initial hidden state and `gsap.to()` to animate to the visible state. Do **not** use `gsap.from()` — it causes elements to flash or fail to animate when ScrollTrigger's inline styles conflict with CSS.

### Image Parallax

- Image element (the `<img>` child inside the image wrapper) has CSS `transform: scale(1.2) translateY(-10%)` as its initial state to provide overflow for the parallax range
- `gsap.to()` on the image with `yPercent: 20`, scrub, and `ease: "none"` across the full card visibility range (`start: "top bottom"`, `end: "bottom top"`)

`[@test] ../src/components/Projects/ProjectCard.animation.test.tsx`

## "Projects" Heading Animation

- The "Projects" heading uses an entrance-only animation (no exit)
- Fades in from below with scrub as it enters the viewport
- Uses `gsap.from()` with ScrollTrigger, `start: "top 70%"`, scrub

## Layout

- Vertical stack of full-width cards
- Alternating layout: image left / image right (or consistent one-side)
- Responsive: stacks vertically on mobile (image on top, text below)
- Section heading: "Projects" or similar
