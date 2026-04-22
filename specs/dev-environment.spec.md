---
name: Dev Environment
description: Local development setup with Vite and nginx running in Docker for DAV/auth support
targets:
  - ../vite.config.ts
  - ../docker-compose.yaml
  - ../nginx.conf
  - ../package.json
  - ../.htpasswd
---

# Dev Environment

Local development uses two processes: Vite (HMR, React) on port `5173` and nginx (Docker) on port `5174`. Vite proxies `/images` and `/content` to the nginx container so the admin page works identically to production.

## Architecture

```
Browser :5173
  └── Vite dev server
        ├── /* → React SPA (HMR)
        ├── /images/* → proxy → nginx :5174
        └── /content/* → proxy → nginx :5174

nginx :5174
  ├── /content/  — public GET, auth-protected PUT (Basic Auth + DAV)
  └── /images/   — public GET/HEAD + autoindex JSON, auth-protected PUT/DELETE/MOVE
```

## Vite Proxy (`vite.config.ts`)

- Dev server runs on port `5173`
- `/images` and `/content` are proxied to `http://localhost:5174`
- No proxy plugin — standard Vite `server.proxy` config

## Docker Compose (`docker-compose.yaml`)

- Service: `nginx:alpine` named `nginx-for-dev-portfolio`
- Port mapping: `5174:80`
- Volumes mounted read-write unless noted:
  - `./public/images` → `/usr/share/nginx/html/images`
  - `./public/content` → `/usr/share/nginx/html/content`
  - `./nginx.conf` → `/etc/nginx/conf.d/default.conf` (read-only)
  - `./.htpasswd` → `/etc/nginx/.htpasswd` (read-only)
- `restart: unless-stopped`

## npm Scripts

- `npm run nginx` — starts nginx via `docker run` (equivalent to `docker compose up`, useful outside WSL)
- `npm run dev` — starts Vite dev server

## `.htpasswd` Setup

- File must exist at the project root before starting nginx
- Format: `<username>:<apr1-hashed-password>`
- Generate password hash: `openssl passwd -apr1`
- Example entry: `admin:$apr1$...`
- File is never committed to source control

## WSL Note

Docker may not be available inside WSL directly. In that case:
- Run `docker compose up -d` from Windows (host) to start nginx on port `5174`
- Run `npm run dev` inside WSL as normal

## nginx Configuration (shared with production)

The same `nginx.conf` is used for both dev (via Docker volume) and production (copied into the image). Key behaviours relevant to dev:

- `autoindex on` + `autoindex_format json` on `/images/` — enables the image manager directory listing
- `dav_methods PUT DELETE MOVE` on `/images/` — enables upload, delete, rename
- `dav_methods PUT` on `/content/` — enables YAML saves
- `auth_basic` on all write operations uses `.htpasswd`
- `client_max_body_size 20M` on `/images/` — limits upload size
