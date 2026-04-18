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

- Fixed position, vertically centered on the side specified by `side` field ("left" or "right")
- Vertical list of items, stacked top to bottom
- Always visible regardless of scroll position

`[@test] ../src/components/ContactsSidebar/ContactsSidebar.test.tsx`

## Behavior

- Items with a `url` render as clickable text links (open in new tab for external URLs)
- Items without a `url` render as plain, non-clickable text
- List can have any number of items

## Styling

- Small, unobtrusive text (rotated vertically or horizontal — consistent with design)
- Subtle hover effect on links
- Does not overlap main content on narrow viewports (consider hiding or repositioning on mobile)
