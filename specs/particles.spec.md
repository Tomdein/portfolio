---
name: Particles
description: Unified canvas-particles-js layer for loading screen and site background
targets:
  - ../src/components/Particles/Particles.tsx
  - ../src/components/Particles/Particles.module.scss
  - ../src/components/ParticleToggle/ParticleToggle.tsx
  - ../src/components/ParticleToggle/ParticleToggle.module.scss
---

# Particles

A single `canvas-particles-js` particle layer used for both the loading screen background and the persistent site background.

## Implementation

- Uses `canvas-particles-js` library (production dependency)
- Single `<canvas>` element, fixed-position (`position: fixed`), behind all content (`z-index: -1` or lowest layer)
- The canvas persists across loading screen and site — no destroy/recreate cycle
- Particle style: subtle, ambient dots/connections consistent with the dark theme

`[@test] ../src/components/Particles/Particles.test.tsx`

## Configuration Flags (from `site.yaml`)

### `enableLoadingParticles`

- `true` — particles render during the loading screen
- `false` — no particles during loading; canvas remains hidden until site loads (if background particles are enabled)

### `enableBackgroundParticles`

- `true` — particles persist as site background after loading completes; a runtime UI toggle is also shown
- `false` — particles fade out after loading completes (if they were shown during loading)

## Runtime UI Toggle

- Rendered only when `enableBackgroundParticles` is `true` in `site.yaml`
- Small toggle button in a fixed corner position (e.g., bottom-right)
- ANDed logic: particles show only when config flag = true AND user toggle = on
- Toggle defaults to "on" on page load
- Toggle state is local (not persisted across page reloads)

`[@test] ../src/components/ParticleToggle/ParticleToggle.test.tsx`

## Lifecycle

1. App mounts → if `enableLoadingParticles` is true, particles start immediately (behind loading screen)
2. Loading completes → loading screen fades out
3. If `enableBackgroundParticles` is true → particles remain, toggle appears
4. If `enableBackgroundParticles` is false → particles fade out after loading screen exit
5. User toggles off → particles pause/hide; toggle on → particles resume/show
