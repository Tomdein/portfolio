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
- `infoLine` — subtitle shown below the name (replaces the old tagline)

## about.yaml

```yaml
text: "Short paragraph about the person. Can be 2-4 sentences."
```

- `text` — the about section paragraph content

## tagline.yaml

```yaml
text: "A Maker, Programmer and Mathematician"
backgroundImage: "/images/tagline-bg.webp"
```

- `text` — tagline text displayed over the background image
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
- Required fields per project: `title`, `description`, `tags`, `image`, `order`
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

- `motto` — optional quoted text; if omitted, footer renders as an empty spacer
- `author` — name displayed next to the motto, slightly offset vertically

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
