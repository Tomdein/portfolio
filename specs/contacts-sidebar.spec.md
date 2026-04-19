---
name: Contacts Sidebar
description: Fixed vertical list of contact items on the side of the viewport
targets:
  - ../src/components/ContactsSidebar/ContactsSidebar.tsx
  - ../src/components/ContactsSidebar/ContactsSidebar.module.scss
---

# Contacts Sidebar

A fixed-position vertical list of contact/social items on one side of the viewport.

## Data

Loaded from `contacts.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md)):

```yaml
side: "right"
items:
  - label: "GitHub"
    url: "https://github.com/..."
  - label: "LinkedIn"
    url: "https://linkedin.com/..."
  - label: "Email"
    url: "mailto:..."
  - label: "+43 123 456 789"
```

## Layout

- **Mobile** (below `$bp-wider`): fixed bar at `top: 0`, full viewport width, items in a horizontal centered row with `flex-wrap: wrap`
- **Desktop** (`$bp-wider`+): fixed, vertically centered (`top: 50%; transform: translateY(-50%)`), stacked column on the side specified by `side` ("left" or "right"); decorative horizontal separator lines (`3rem wide × 1px tall`) above and below the list via `::before`/`::after`

`[@test] ../src/components/ContactsSidebar/ContactsSidebar.test.tsx`

## GSAP Scroll Animation

Uses `useGSAP()` hook (not `useEffect`).

- Sidebar fades out as it scrolls past the top of the viewport
- `gsap.to(sidebar, { opacity: 0 })` with ScrollTrigger: `start: 'top 0%'`, `end: 'bottom 0%'`, `scrub: true`

## Behavior

- Items with a `url` render as clickable text links (open in new tab for external URLs)
- Items without a `url` render as plain, non-clickable text
- List can have any number of items

## Styling

- Link and plain-text color: `$color-accent4-muted`; link hover: `$color-accent4-muted-hover`
- Subtle hover effect on links
- Horizontal separator lines shown only on desktop
