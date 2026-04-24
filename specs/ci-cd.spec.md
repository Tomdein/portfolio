---
name: CI/CD Pipeline
description: GitHub Actions workflows for testing, building, deploying, and releasing
targets:
  - ../.github/workflows/ci.yml
  - ../.github/workflows/deploy.yml
  - ../.github/workflows/release.yml
  - ../Dockerfile
  - ../entrypoint.sh
---

# CI/CD Pipeline

GitHub Actions automates testing, building, container image publishing, and GitOps releases.

## CI Workflow (`.github/workflows/ci.yml`)

Triggers on every push and pull request to `main`.

### Steps

1. **Checkout** code
2. **Setup Node.js** (LTS version, e.g., 22.x)
3. **Install dependencies** (`npm ci`)
4. **Lint** (`npm run lint`)
5. **Run tests** (`npm run test`)
6. **Build** (`npm run build`) — ensures production build succeeds

`[@test] ../.github/workflows/ci.yml`

## Release Workflow (`.github/workflows/release.yml`)

Triggers **only** on pushed tags matching the pattern `v[0-9]+.[0-9]+.[0-9]+` (e.g. `v1.2.3`).
No other branches or events trigger this workflow.

### Steps

1. **Checkout** portfolio repo
2. **Extract version** — strip the leading `v` from the tag (e.g. `v1.2.3` → `1.2.3`)
3. **Log in to ghcr.io** using `GITHUB_TOKEN`
4. **Build and push Docker image** — tagged with the extracted version (e.g. `1.2.3`) and `latest`
5. **Checkout `portfolio-helm` repo** — clone `github.com/Tomdein/portfolio-helm` using `HELM_REPO_PAT`
6. **Patch `image.tag`** — update `image.tag` in `charts/values.yaml` to the extracted version using `yq` or `sed`
7. **Commit and push** — commit the change to `portfolio-helm` with message `chore: update image tag to <version>`; push to `main`

ArgoCD detects the commit in `portfolio-helm` and syncs the cluster automatically.

### Secrets Required

- `GITHUB_TOKEN` — automatic; used for ghcr.io image push
- `HELM_REPO_PAT` — Personal Access Token with `contents: write` permission on `github.com/Tomdein/portfolio-helm`

`[@test] ../.github/workflows/release.yml`

## Dockerfile

Multi-stage build:

1. **Build stage**: Node.js image, install deps, run `npm run build`
2. **Serve stage**: Nginx alpine image:
   - Copy build output to `/usr/share/nginx/html` (app bundle, not bind-mounted)
   - Copy `dist/content` to `/app/defaults/content` (seed data for first deployment)
   - Copy `dist/images/projects` to `/app/defaults/images/projects` (seed data for first deployment)
   - Copy `entrypoint.sh` into the image and make it executable
3. Expose port 80
4. `ENTRYPOINT ["/entrypoint.sh"]`

Custom `nginx.conf` for SPA routing (all routes → `index.html`)

`[@test] ../Dockerfile`

## Entrypoint (`entrypoint.sh`)

Runs before Nginx starts:

- If `/usr/share/nginx/html/content` is empty, seed it from `/app/defaults/content` (first deployment only)
- If `/usr/share/nginx/html/images/projects` is empty, seed it from `/app/defaults/images/projects` (first deployment only)
- Then exec `nginx -g "daemon off;"`

The app bundle (`index.html`, `assets/`) is baked into the image and always up to date without any copy step.
Only the two bind-mounted subdirectories (`content/` and `images/projects/`) are seeded on first run;
subsequent deployments preserve operator changes to those directories.

`[@test] ../entrypoint.sh`
