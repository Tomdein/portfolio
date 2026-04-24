# ── Build stage ──
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Serve stage ──
FROM nginx:alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
# App bundle goes directly into html — no bind mount on this directory
COPY --from=build /app/dist /usr/share/nginx/html
# Keep defaults for first-run seeding of bind-mounted subdirectories
COPY --from=build /app/dist/content /app/defaults/content
COPY --from=build /app/dist/images/projects /app/defaults/images/projects
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
