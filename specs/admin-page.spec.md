---
name: Admin Page
description: Password-protected YAML config editor at /config route
targets:
  - ../src/pages/Admin/Admin.tsx
  - ../src/pages/Admin/Admin.module.scss
  - ../src/pages/Admin/YamlEditor.tsx
  - ../src/pages/Admin/ImageManager.tsx
  - ../nginx.conf
---

# Admin Page

A password-protected page at `/config` for editing all YAML configuration files.

## Routing

- React Router route at `/config`, lazy-loaded (`React.lazy`) to avoid impacting the portfolio bundle
- Same SPA — no separate build

`[@test] ../src/pages/Admin/Admin.test.tsx`

## Authentication

- Nginx `ngx_http_dav_module` handles write requests to `/content/` and `/images/` paths
- PUT/DELETE/MOVE requests are protected by HTTP Basic Auth via `.htpasswd` file
- GET requests to `/content/` and `/images/` remain public (no auth required for reading)
- On navigating to `/config`, a login form is shown **immediately** — the admin UI is never visible without valid credentials
- Credentials are verified by sending a `DELETE /images/__auth_check__` request with Basic Auth before granting access:
  - Any response other than `401` → credentials accepted, admin UI rendered
  - `401` response → credentials rejected, page renders nothing (empty)
- After successful login, credentials are held in React state and reused for all write operations
- On sign-out, credentials are cleared and the login form is shown again
- If a write operation returns `401` mid-session, the user is returned to the login form

## Editor Interface

- Two tabs on the `/config` page: **YAML Editor** and **Image Manager**
- Lists all YAML config files: `hero.yaml`, `about.yaml`, `projects.yaml`, `tagline.yaml`, `contacts.yaml`, `footer.yaml`, `site.yaml`
- Each file has a raw YAML text editor (textarea)
- On mount: automatically fetches the current YAML content via GET (no manual load step)
- A **Reload** button allows re-fetching the current file content at any time
- On save: PUTs the edited content back to Nginx with the stored Basic Auth credentials
- Shows success/error feedback after save attempts

`[@test] ../src/pages/Admin/YamlEditor.test.tsx`

## Image Manager

A dedicated tab/section on the `/config` page for managing images served from `/images/`.

### Display

- Grid of thumbnails; each cell shows the image, filename, and action buttons (rename, delete)
- Images fetched by listing files under `/images/` (see Nginx config below)
- Accepted file types for upload: `jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`, `avif`

`[@test] ../src/pages/Admin/ImageManager.test.tsx`

### Upload

- File picker (accept attribute restricts to accepted types) or drag-and-drop
- On select: PUT to `/images/<filename>` with Basic Auth credentials
- Shows upload progress and success/error feedback per file
- Grid updates after successful upload

### Delete

- Delete button per thumbnail cell
- Sends HTTP `DELETE` to `/images/<filename>` with Basic Auth credentials
- Prompts for confirmation before sending the request
- Removes the cell from the grid on success; shows error feedback on failure

### Rename / Move

- Rename action per thumbnail cell (inline edit of filename)
- Sends HTTP `MOVE` to `/images/<oldname>` with `Destination: /images/<newname>` header and Basic Auth credentials
- Updates the grid cell on success; shows error feedback on failure

### Authentication

- All write operations (PUT, DELETE, MOVE) use the same Basic Auth credentials as the YAML editor
- Credentials are entered once per session (same credential state shared across tabs)

## Nginx Configuration

```nginx
# YAML content files — public GET, auth-protected PUT
location /content/ {
    root /usr/share/nginx/html;

    # GET — public, no auth
    limit_except PUT {
        allow all;
    }

    # PUT — requires Basic Auth + DAV
    dav_methods PUT;
    auth_basic "Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;

    client_body_temp_path /tmp/nginx;
    create_full_put_path on;
}

# Images — public GET, auth-protected PUT / DELETE / MOVE
location /images/ {
    root /usr/share/nginx/html;

    # GET — public, no auth (used for thumbnails and site display)
    limit_except PUT DELETE MOVE {
        allow all;
    }

    # Write operations — require Basic Auth + DAV
    dav_methods PUT DELETE MOVE;
    dav_ext_methods PROPFIND OPTIONS;  # enables directory listing for image grid
    auth_basic "Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;

    client_body_temp_path /tmp/nginx;
    create_full_put_path on;
}
```

- `.htpasswd` file mounted into the container (via Kubernetes secret or Docker volume)
- `/content/` allows PUT only (no DELETE/MOVE) — YAML files are never deleted via the UI
- `/images/` allows PUT, DELETE, and MOVE — required for upload, delete, and rename operations
- PROPFIND/OPTIONS enabled on `/images/` so the image manager can list existing files
- MKCOL (directory creation) is intentionally **not** enabled on either path

## Security

- No credentials stored in the React app or source code
- `.htpasswd` uses bcrypt-hashed passwords
- `/content/` is PUT-only — YAML files cannot be deleted or moved via DAV
- `/images/` allows PUT, DELETE, MOVE but not MKCOL — directory creation is prevented
- DELETE confirmation prompt on the client prevents accidental deletion
- Admin route itself is public (just a form), but all write operations require valid credentials
