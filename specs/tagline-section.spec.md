---
name: Tagline Section
description: Full-width section with B&W background image parallax and animated tagline text
targets:
  - ../src/components/Tagline/Tagline.tsx
  - ../src/components/Tagline/Tagline.module.scss
---

# Tagline Section

A visual break between the hero and about sections. Displays a single tagline over a large black & white background image.

## Data

Loaded from `tagline.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md)):

```yaml
text: "A Maker, Programmer and Mathematician"
backgroundImage: "/images/tagline-bg.webp"
```

- `text` supports Markdown formatting (bold, italic, etc.) via showdown + DOMPurify; rendered into a `<div>` with `dangerouslySetInnerHTML`
- `backgroundImage` — path to a B&W background image (relative to `public/`)

## Layout

- Full-width section, generous vertical height
- Large B&W background image covers the entire section
- Tagline text centered over the image
- Text should have sufficient contrast against the image (text shadow or overlay)

`[@test] ../src/components/Tagline/Tagline.test.tsx`

## GSAP Scroll Animation

Uses `useGSAP()` hook (not `useEffect`).

### Background Image Parallax

- Background image moves slightly faster than the content during scroll
- Creates a depth/parallax effect
- Implemented via `gsap.to()` with ScrollTrigger scrub on the image element

### Tagline Text

- Initial hidden state set via CSS on `.text` (`opacity: 0; y: 40`) — not via `gsap.from()`
- A single `gsap.to()` with **keyframes** drives both entrance and exit:
  - Step 1: `{y: 0, opacity: 1, duration: 0.5, ease: 'sine.in'}` — slides in and fades up
  - Step 2: `{y: -40, opacity: 0, duration: 0.5, ease: 'sine.out'}` — slides out upward and fades
- ScrollTrigger: `trigger: text` (the text element itself), `start: 'top 90%'`, `end: 'bottom 10%'`, `scrub: 0.5`, `toggleActions: 'play complete none reverse'`, `fastScrollEnd: true`

`[@test] ../src/components/Tagline/Tagline.animation.test.tsx`

## Styling

- Section height: `120vh` (provides scroll room for the keyframe sequence), `min-height: 400px`
- Background image: `object-fit: cover`, B&W, full bleed
- Text: large, bold, white with text-shadow or semi-transparent dark overlay for legibility
- Responsive: text scales appropriately on mobile
