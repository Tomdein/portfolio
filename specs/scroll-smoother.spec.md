---
name: ScrollSmoother
description: GSAP ScrollSmoother for smooth momentum-based scrolling across the portfolio
targets:
  - ../src/App.tsx
  - ../src/components/SmoothWrapper/SmoothWrapper.tsx
---

# ScrollSmoother

GSAP ScrollSmoother wraps the entire portfolio page for smooth, momentum-based scrolling.

## Implementation

- Uses GSAP's `ScrollSmoother` plugin (free as of 2025)
- Wraps all portfolio sections (Hero, Tagline, About, Projects, Footer) in the required `#smooth-wrapper` > `#smooth-content` structure
- Does **not** wrap the admin `/config` route — only the portfolio page
- All existing ScrollTrigger animations remain compatible

`[@test] ../src/components/SmoothWrapper/SmoothWrapper.test.tsx`

## Configuration

- `smooth`: ~1.5–2 (adjustable) for subtle momentum
- `effects`: enabled for parallax-compatible elements
- Integrates with the scroll-locking mechanism used during loading (scroll disabled until assets loaded)

## useGSAP() Migration

- All components replace `useEffect()` / `useLayoutEffect()` with `useGSAP()` from `@gsap/react`
- `useGSAP()` automatically handles GSAP context cleanup on unmount
