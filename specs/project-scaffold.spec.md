---
name: Project Scaffold
description: Vite + React + TypeScript project setup with GSAP, ScrollTrigger, and modular SCSS
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
- **Animations**: GSAP 3+ with ScrollTrigger plugin
- **Styling**: Modular SCSS (CSS Modules with `.module.scss` files)
- **Content**: Markdown files with YAML frontmatter for project data

`[@test] ../src/App.test.tsx`

## Entry Point

- `index.html` loads `/src/main.tsx`
- `main.tsx` renders `<App />` into `#root`
- `App.tsx` composes the three main sections: Hero, About, Projects

## SCSS Architecture

- Global variables and resets live in `src/styles/_variables.scss` and `src/styles/_reset.scss`
- Each component has a co-located `.module.scss` file
- Dark theme only — background: near-black (#0a0a0a), text: off-white (#f0f0f0)
- Accent color as a SCSS variable for easy customization

## Dependencies

Required production dependencies:

- `react`, `react-dom`
- `gsap` (with ScrollTrigger)
- `gray-matter` or equivalent for parsing markdown frontmatter
- `marked` or equivalent for rendering markdown

Required dev dependencies:

- `vite`
- `@vitejs/plugin-react`
- `typescript`
- `sass`
- `vitest` + `@testing-library/react` for testing
- `eslint` with React + TypeScript config
