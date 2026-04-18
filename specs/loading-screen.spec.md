---
name: Loading Screen
description: Full-viewport loading overlay with name display and throbber
targets:
  - ../src/components/LoadingScreen/LoadingScreen.tsx
  - ../src/components/LoadingScreen/LoadingScreen.module.scss
---

# Loading Screen

Full-viewport overlay displayed while YAML config files and images are being fetched.

## Behavior

- Shown immediately on app mount, before any section content renders
- Fetches all YAML files (`hero.yaml`, `about.yaml`, `projects.yaml`, `site.yaml`) in parallel
- Also preloads project images referenced in `projects.yaml`
- Minimum display time of ~1 second so the animation is always visible, even on fast connections
- After all assets are loaded AND the minimum time has elapsed, the loading screen transitions out

`[@test] ../src/components/LoadingScreen/LoadingScreen.test.tsx`

## Display

- Full viewport (`100vw × 100vh`), fixed position, highest z-index
- Displays the name from `hero.yaml` (the `name` field), centered
- A throbber/spinner below the name indicating loading progress
- Dark background matching the site theme

## Exit Transition

- Fade-out or dissolve animation to reveal the site beneath
- GSAP-driven transition for consistency with the rest of the portfolio
- After transition completes, the loading screen component unmounts

`[@test] ../src/components/LoadingScreen/LoadingScreen.animation.test.tsx`
