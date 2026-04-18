---
name: YAML Configuration
description: Runtime YAML-driven content configuration for all portfolio sections
targets:
  - ../public/content/hero.yaml
  - ../public/content/about.yaml
  - ../public/content/projects.yaml
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
name: "Tomas Deingruber"
tagline: "A Maker, Programmer and Mathematician"
```

- `name` — display name shown in the hero section and on the loading screen
- `tagline` — subtitle shown below the name

## about.yaml

```yaml
text: "Short paragraph about the person. Can be 2-4 sentences."
```

- `text` — the about section paragraph content

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

## site.yaml

```yaml
enableLoadingParticles: true
enableBackgroundParticles: true
```

- `enableLoadingParticles` — show particles during the loading screen
- `enableBackgroundParticles` — persist particles as site background after loading; if true, also renders a runtime UI toggle

## TypeScript Types

All YAML schemas are represented as TypeScript interfaces in `src/types/config.ts`.

`[@test] ../src/types/config.test.ts`
