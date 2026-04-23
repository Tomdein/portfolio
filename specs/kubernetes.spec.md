---
name: Kubernetes Deployment
description: Helm chart in a separate repo for deploying the portfolio Nginx container via ArgoCD
targets:
  - ../.github/workflows/release.yml
---

# Kubernetes Deployment

The Helm chart lives in the dedicated repository **`github.com/Tomdein/portfolio-helm`** (not inside this repo).
ArgoCD watches that repo directly and applies changes to the cluster automatically.

The `helm/` directory has been removed from this repository. All chart changes must be made in `portfolio-helm`.

## Chart structure (in `github.com/Tomdein/portfolio-helm`)

```
helm/portfolio/
  Chart.yaml
  values.yaml
  templates/
    _helpers.tpl
    namespace.yaml
    deployment.yaml
    service.yaml
    ingress.yaml
```

## values.yaml parameters

| Key | Default | Description |
|-----|---------|-------------|
| `namespace` | `portfolio` | Kubernetes namespace for all resources |
| `replicaCount` | `2` | Number of pod replicas |
| `image.repository` | `ghcr.io/Tomdein/portfolio` | Container image repository |
| `image.tag` | `latest` | Container image tag — updated automatically on each versioned release |
| `image.pullPolicy` | `IfNotPresent` | Image pull policy |
| `resources.requests.cpu` | `50m` | CPU request |
| `resources.requests.memory` | `64Mi` | Memory request |
| `resources.limits.cpu` | `100m` | CPU limit |
| `resources.limits.memory` | `128Mi` | Memory limit |
| `publicContent.hostPath` | `/data/portfolio/public` | Node path mounted into `/usr/share/nginx/html` |
| `ingress.host` | `portfolio.example.com` | Ingress hostname |
| `ingress.tls.enabled` | `false` | Enable TLS on the ingress |
| `ingress.tls.secretName` | `portfolio-tls` | TLS secret name (when TLS enabled) |

## Automated image tag update

When a tag matching `vX.Y.Z` is pushed to this repo the release workflow (see `ci-cd.spec.md`) clones
`portfolio-helm`, patches `image.tag` in `values.yaml` to the stripped version (e.g. `v1.2.3` → `1.2.3`),
and pushes the commit. ArgoCD then detects the change and syncs the cluster.

`[@test] ../.github/workflows/release.yml`

## Deployment template requirements

- Replica count from `values.replicaCount`
- Image `{{ image.repository }}:{{ image.tag }}`, pull policy from values
- Port: 80
- Resources (requests & limits) from values
- Liveness probe: HTTP GET `/` port 80, `initialDelaySeconds: 5`, `periodSeconds: 10`
- Readiness probe: HTTP GET `/` port 80, `initialDelaySeconds: 3`, `periodSeconds: 5`
- Rolling update strategy: `maxSurge: 1`, `maxUnavailable: 0`
- `hostPath` volume mounted at `/usr/share/nginx/html` from `values.publicContent.hostPath` (`DirectoryOrCreate`)

## Service template requirements

- Type: `ClusterIP`
- Port 80 → container port 80
- Selector matches deployment labels

## Ingress template requirements

- `ingressClassName: nginx`
- Host from `values.ingress.host`
- Routes path `/` (`pathType: Prefix`) to the service on port 80
- Annotations: `nginx.ingress.kubernetes.io/rewrite-target: /`, `ssl-redirect` set from `values.ingress.tls.enabled`
- TLS block rendered only when `values.ingress.tls.enabled` is `true`
