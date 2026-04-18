---
name: Admin Page
description: Password-protected YAML config editor at /config route
targets:
  - ../src/pages/Admin/Admin.tsx
  - ../src/pages/Admin/Admin.module.scss
  - ../src/pages/Admin/YamlEditor.tsx
  - ../nginx.conf
---

# Admin Page

A password-protected page at `/config` for editing all YAML configuration files.

## Routing

- React Router route at `/config`, lazy-loaded (`React.lazy`) to avoid impacting the portfolio bundle
- Same SPA — no separate build

`[@test] ../src/pages/Admin/Admin.test.tsx`

## Authentication

- Nginx `ngx_http_dav_module` handles PUT requests to `/content/` paths
- PUT requests are protected by HTTP Basic Auth via `.htpasswd` file
- GET requests to `/content/` remain public (no auth required for reading YAML)
- The admin page prompts for credentials before attempting any write operation

## Editor Interface

- Lists all YAML config files: `hero.yaml`, `about.yaml`, `projects.yaml`, `tagline.yaml`, `contacts.yaml`, `footer.yaml`, `site.yaml`
- Each file has a raw YAML text editor (textarea or code editor)
- On load: fetches the current YAML content via GET
- On save: PUTs the edited content back to Nginx with Basic Auth credentials
- Shows success/error feedback after save attempts

`[@test] ../src/pages/Admin/YamlEditor.test.tsx`

## Nginx Configuration

```nginx
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
```

- `.htpasswd` file mounted into the container (via Kubernetes secret or Docker volume)
- DAV module only allows PUT (not DELETE, MKCOL, etc.) for safety

## Security

- No credentials stored in the React app or source code
- `.htpasswd` uses bcrypt-hashed passwords
- PUT-only scope prevents file deletion or directory creation via DAV
- Admin route itself is public (just a form), but writes require valid credentials
