---
name: Project Scaffold
description: Vite + React + TypeScript project setup with GSAP, ScrollSmoother, and modular SCSS
targets:
  - ../package.json
  - ../vite.config.ts
  - ../tsconfig.json
  - ../tsconfig.app.json
  - ../tsconfig.node.json
  - ../index.html
  - ../src/main.tsx
  - ../src/App.tsx
  - ../src/vite-env.d.ts
  - ../src/styles/**/*.scss
---

# Project Scaffold

The portfolio is a single-page application built with Vite + React + TypeScript.

## Tech Stack

- **Bundler**: Vite 6+
- **Framework**: React 19+ with TypeScript
- **Animations**: GSAP 3+ with ScrollTrigger + ScrollSmoother plugins
- **GSAP React**: `@gsap/react` — use `useGSAP()` hook instead of `useEffect()`/`useLayoutEffect()` for all GSAP code
- **Styling**: Modular SCSS (CSS Modules with `.module.scss` files)
- **Content**: YAML config files fetched at runtime (`public/content/*.yaml`)
- **Routing**: React Router (SPA with `/` portfolio and `/config` admin route)

`[@test] ../src/App.test.tsx`

## Entry Point

- `index.html` loads `/src/main.tsx`
- `main.tsx` renders `<App />` into `#root`
- `App.tsx` sets up React Router with two routes:
  - `/` — portfolio page (Hero, Tagline, About, Projects, Footer) wrapped in ScrollSmoother
  - `/config` — admin page (lazy-loaded)

## ScrollSmoother

- GSAP ScrollSmoother wraps the entire portfolio page
- Provides smooth, momentum-based scrolling across all sections
- See [scroll-smoother spec](scroll-smoother.spec.md)

## SCSS Architecture

- Global variables and resets live in `src/styles/_variables.scss` and `src/styles/_reset.scss`
- Each component has a co-located `.module.scss` file
- Dark theme only — background: near-black (#0a0a0a), text: off-white (#f0f0f0)
- Accent color as a SCSS variable for easy customization

## Dependencies

Required production dependencies:

- `react`, `react-dom`, `react-router-dom`
- `gsap` (with ScrollTrigger + ScrollSmoother)
- `@gsap/react` (useGSAP hook)
- `js-yaml` (runtime YAML parsing)
- `canvas-particles-js` (particle animations)
- `pretext` by chenglou (text measurement)

Required dev dependencies:

- `vite`
- `@vitejs/plugin-react`
- `typescript`
- `sass`
- `vitest` + `@testing-library/react` for testing
- `eslint` with React + TypeScript config
