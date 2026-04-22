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

A dedicated tab on the `/config` page for browsing and managing files under `/images/`, including subdirectories.

### Folder Browser

- Starts at the root of `/images/`
- Lists both **directories** (folder grid) and **files** (thumbnail grid) at the current path
- Directories are displayed above files, sorted alphabetically within each group
- Clicking a directory navigates into it (loads that path's contents)
- **Breadcrumb bar** at the top shows the current path (`images / subfolder / ...`); each segment is a clickable link to navigate back to that level
- **← Up** button in the toolbar navigates to the parent directory (hidden at root)
- Listing fetches `GET /images/<current-path>/` which returns a JSON array via nginx `autoindex_format json`
- Entries with `type: "directory"` are shown as folder tiles; entries with `type: "file"` are shown as thumbnail cells
- Non-image files (non-matching extension) show a generic file icon instead of a thumbnail
- Accepted image extensions for thumbnail display: `jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`, `avif`

`[@test] ../src/pages/Admin/ImageManager.test.tsx`

### Upload

- Drop zone (click or drag & drop) uploads into the **current directory**
- File picker restricts accepted types to: `jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`, `avif`
- On select: PUT to `/images/<current-path>/<filename>` with Basic Auth credentials
- Shows upload feedback per file; grid refreshes after upload

### Delete

- Delete button per file cell
- Sends HTTP `DELETE` to `/images/<current-path>/<filename>` with Basic Auth credentials
- Prompts for confirmation before sending
- Removes the cell on success; shows error feedback on failure

### Rename / Move

- Inline rename per file cell
- Sends HTTP `MOVE` to `/images/<current-path>/<oldname>` with `Destination: <origin>/images/<current-path>/<newname>` header and Basic Auth credentials
- Updates the grid cell on success; shows error feedback on failure

### Authentication

- All write operations (PUT, DELETE, MOVE) use the same Basic Auth credentials as the YAML editor
- Credentials are entered once per session (same credential state shared across tabs)

## Nginx Configuration

```nginx
# YAML content files — public GET, auth-protected everything else
location /content/ {
    root /usr/share/nginx/html;

    limit_except GET {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    dav_methods PUT;
    dav_access user:rw group:rw all:rw;

    client_body_temp_path /tmp/nginx;
    create_full_put_path on;
}

# Images — public GET/HEAD, auth-protected everything else
location /images/ {
    client_max_body_size 20M;
    root /usr/share/nginx/html;

    # Directory listing for image manager (returns JSON array)
    autoindex on;
    autoindex_format json;

    limit_except GET HEAD {
        auth_basic "Admin";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    dav_methods PUT DELETE MOVE;
    client_body_temp_path /tmp/nginx;
    create_full_put_path on;
}
```

- `.htpasswd` file mounted into the container (via Kubernetes secret or Docker volume)
- Auth directives are inside `limit_except` blocks — GET (and HEAD for `/images/`) are unconditionally public
- `/content/` allows PUT only (no DELETE/MOVE) — YAML files are never deleted via the UI
- `/images/` allows PUT, DELETE, and MOVE — required for upload, delete, and rename operations
- Directory listing on `/images/` uses nginx `autoindex_format json` — no PROPFIND/WebDAV extension needed
- `client_max_body_size 20M` limits image upload size
- MKCOL (directory creation) is intentionally **not** enabled on either path

## Security

- No credentials stored in the React app or source code
- `.htpasswd` uses bcrypt-hashed passwords
- `/content/` is PUT-only — YAML files cannot be deleted or moved via DAV
- `/images/` allows PUT, DELETE, MOVE but not MKCOL — directory creation is prevented
- DELETE confirmation prompt on the client prevents accidental deletion
- Admin route itself is public (just a form), but all write operations require valid credentials
