#!/bin/sh
set -e

CONTENT_DIR=/usr/share/nginx/html/content
IMAGES_DIR=/usr/share/nginx/html/images/projects

# Seed content on first deployment (bind-mounted dir is empty)
if [ -z "$(ls -A "$CONTENT_DIR" 2>/dev/null)" ]; then
  echo "Seeding content..."
  mkdir -p "$CONTENT_DIR"
  cp -r /app/defaults/content/. "$CONTENT_DIR/"
fi

# Seed images/projects on first deployment (bind-mounted dir is empty)
if [ -z "$(ls -A "$IMAGES_DIR" 2>/dev/null)" ]; then
  echo "Seeding images/projects..."
  mkdir -p "$IMAGES_DIR"
  cp -r /app/defaults/images/projects/. "$IMAGES_DIR/"
fi

exec nginx -g "daemon off;"
