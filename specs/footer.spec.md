---
name: Footer
description: Bottom section with optional quoted motto and spacer function
targets:
  - ../src/components/Footer/Footer.tsx
  - ../src/components/Footer/Footer.module.scss
---

# Footer

The bottom section of the portfolio. Serves as both a visual endpoint and a spacer so the last project card's exit animation completes in the top 1/3 of the screen.

## Data

Loaded from `footer.yaml` at runtime (see [yaml-config spec](yaml-config.spec.md)):

```yaml
motto: "The only way to do great work is to love what you do."
author: "Steve Jobs"
```

- `motto` and `author` support Markdown formatting and raw HTML (sanitized by DOMPurify)
- `motto` rendered via `mdToHtml()` into a `<div>` — block-level structure preserved
- `author` rendered via `mdToInlineHtml()` inside a `<cite>` — outer `<p>` stripped to avoid nesting

## Layout

- If `motto` and `author` are provided: displays a quoted motto with the author name slightly offset vertically beside it
- If `motto` is omitted or empty: renders as an empty spacer (no visible content)
- Sufficient height to ensure the last project card finishes its exit animation in the top 1/3 of the viewport

`[@test] ../src/components/Footer/Footer.test.tsx`

## Styling

- Motto text in italics or with quote marks, centered or slightly off-center
- Author name: smaller font, offset vertically (slightly below the motto)
- Subtle, minimal design consistent with the rest of the portfolio
- Dark background matching site theme
