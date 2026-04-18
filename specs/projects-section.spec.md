---
name: Projects Section
description: Scrollable list of projects driven by markdown data files
targets:
  - ../src/components/Projects/Projects.tsx
  - ../src/components/Projects/Projects.module.scss
  - ../src/components/Projects/ProjectCard.tsx
  - ../src/components/Projects/ProjectCard.module.scss
  - ../content/projects/*.md
---

# Projects Section

A vertically scrollable list of project cards. Content is driven by markdown files.

## Project Data Format

Each project is a `.md` file in `content/projects/` with YAML frontmatter:

```yaml
---
title: "Project Name"
description: "One-line summary of the project"
tags: ["React", "TypeScript", "GSAP"]
image: "/images/projects/project-name.webp"
link: "https://github.com/user/project"
order: 1
---

Optional longer description in markdown body.
```

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

## Data Loading

- A custom Vite plugin (`plugins/vite-plugin-markdown-frontmatter.ts`) transforms `.md` files into JS modules exporting parsed JSON at **build time**
- `import.meta.glob` imports the pre-parsed data — no runtime parsing, no Node.js code in the browser
- Projects are sorted by `order` field
- No `gray-matter` or `marked` in the browser bundle — all parsing happens in Node.js during build

`[@test] ../src/utils/loadProjects.test.ts`

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

## Layout

- Vertical stack of full-width cards
- Alternating layout: image left / image right (or consistent one-side)
- Responsive: stacks vertically on mobile (image on top, text below)
- Section heading: "Projects" or similar
