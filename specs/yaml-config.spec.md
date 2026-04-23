---
name: YAML Configuration
description: Runtime YAML-driven content configuration for all portfolio sections
targets:
  - ../public/content/hero.yaml
  - ../public/content/about.yaml
  - ../public/content/projects.yaml
  - ../public/content/tagline.yaml
  - ../public/content/contacts.yaml
  - ../public/content/footer.yaml
  - ../public/content/site.yaml
  - ../src/utils/loadConfig.ts
  - ../src/utils/markdown.ts
  - ../src/types/config.ts
---

# YAML Configuration

All text and content on the portfolio is configured via YAML files served as static assets and fetched at runtime.

## File Structure

```
public/content/
  hero.yaml
  about.yaml
  projects.yaml
  tagline.yaml
  contacts.yaml
  footer.yaml
  site.yaml
```

## Markdown Rendering

All freeform text fields support Markdown formatting and raw HTML via `src/utils/markdown.ts`:

- `mdToHtml(md)` — converts Markdown to sanitized HTML (showdown + DOMPurify); keeps block-level `<p>` wrapping; used with a `<div dangerouslySetInnerHTML>` container
- `mdToInlineHtml(md)` — same as above but strips the outer `<p>` tag; used when injecting into an existing block element (`<p>`, `<cite>`) to avoid invalid nesting
- Raw HTML in YAML values passes through showdown and is sanitized by DOMPurify (unsafe attributes like `style` may be stripped)

Markdown-enabled fields: `about.text`, `tagline.text`, `footer.motto`, `footer.author`, `projects[].description`, `hero.infoLine`

`[@test] ../src/utils/loadConfig.test.ts`

## Runtime Loading

- YAML files live in `public/content/` and are served as static assets by Nginx
- Each file is fetched at runtime via `fetch()` and parsed in the browser using `js-yaml`
- `js-yaml` is a production dependency included in the browser bundle
- No build-time parsing — the existing Vite markdown plugin and `gray-matter` are removed

`[@test] ../src/utils/loadConfig.test.ts`

## hero.yaml

```yaml
title: "Ing."
firstName: "Tomas"
lastName: "Deingruber"
infoLine: "Ing. — MSc Computer Science"
```

- `title` — honorific title (e.g., "Ing.", "Dr.")
- `firstName` — first name
- `lastName` — last name
- `infoLine` — subtitle shown below the name; supports Markdown (inline)

## about.yaml

```yaml
text: "Short paragraph about the person. Can be 2-4 sentences."
```

- `text` — the about section paragraph content; supports Markdown

## tagline.yaml

```yaml
text: "A Maker, Programmer and Mathematician"
backgroundImage: "/images/tagline-bg.webp"
```

- `text` — tagline text displayed over the background image; supports Markdown
- `backgroundImage` — path to a B&W background image (relative to `public/`)

## projects.yaml

```yaml
projects:
  - title: "Project Name"
    description: "One-line summary"
    tags: ["React", "TypeScript"]
    image: "/images/projects/project-name.webp"
    link: "https://github.com/user/project"
    order: 1
  - title: "Another Project"
    description: "Another summary"
    tags: ["GSAP"]
    image: "/images/projects/another.webp"
    order: 2
```

- Array of project objects sorted by `order` (ascending)
- `description` — short summary (shown on card); supports Markdown
- Optional: `link`

## contacts.yaml

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

- `side` — which side of the viewport to render the fixed list ("left" or "right")
- `items` — list of contact items; `url` is optional
- Items with `url` render as clickable links; items without render as plain text

## footer.yaml

```yaml
motto: "The only way to do great work is to love what you do."
author: "Steve Jobs"
```

- `motto` — optional quoted text; if omitted, footer renders as an empty spacer; supports Markdown and raw HTML (sanitized)
- `author` — name displayed next to the motto, slightly offset vertically; supports Markdown (inline)

## site.yaml

```yaml
enableLoadingScreen: true
enableLoadingParticles: true
enableBackgroundParticles: true
```

- `enableLoadingScreen` — show the full loading screen overlay; if false, hero name renders immediately with scroll locked until all assets load
- `enableLoadingParticles` — show particles during the loading screen
- `enableBackgroundParticles` — persist particles as site background after loading; if true, also renders a runtime UI toggle

## TypeScript Types

All YAML schemas are represented as TypeScript interfaces in `src/types/config.ts`.

`[@test] ../src/types/config.test.ts`
