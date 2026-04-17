---
name: CI/CD Pipeline
description: GitHub Actions workflows for testing, building, and deploying
targets:
  - ../.github/workflows/ci.yml
  - ../.github/workflows/deploy.yml
---

# CI/CD Pipeline

GitHub Actions automates testing, building, and container image publishing.

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

## Deploy Workflow (`.github/workflows/deploy.yml`)

Triggers on push to `main` branch only (not PRs).

### Steps

1. **Checkout** code
2. **Setup Node.js** and install dependencies
3. **Build** the production bundle
4. **Build Docker image** using the project Dockerfile
5. **Push** the image to a container registry (GitHub Container Registry `ghcr.io`)
6. **Tag** with commit SHA and `latest`

### Secrets Required

- Registry credentials via `GITHUB_TOKEN` (automatic for ghcr.io)

## Dockerfile

Multi-stage build:

1. **Build stage**: Node.js image, install deps, run `npm run build`
2. **Serve stage**: Nginx alpine image, copy build output to `/usr/share/nginx/html`
3. Expose port 80
4. Custom `nginx.conf` for SPA routing (all routes → `index.html`)

`[@test] ../Dockerfile`
