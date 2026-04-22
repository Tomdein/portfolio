---
name: Kubernetes Deployment
description: Helm chart for deploying the portfolio Nginx container
targets:
  - ../helm/portfolio/Chart.yaml
  - ../helm/portfolio/values.yaml
  - ../helm/portfolio/templates/deployment.yaml
  - ../helm/portfolio/templates/service.yaml
  - ../helm/portfolio/templates/ingress.yaml
  - ../helm/portfolio/templates/namespace.yaml
---

# Kubernetes Deployment

Helm chart (`helm/portfolio/`) to deploy the Nginx-based portfolio container.

## Chart structure

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
| `image.repository` | `ghcr.io/OWNER/portfolio` | Container image repository |
| `image.tag` | `latest` | Container image tag |
| `image.pullPolicy` | `IfNotPresent` | Image pull policy |
| `resources.requests.cpu` | `50m` | CPU request |
| `resources.requests.memory` | `64Mi` | Memory request |
| `resources.limits.cpu` | `100m` | CPU limit |
| `resources.limits.memory` | `128Mi` | Memory limit |
| `publicContent.hostPath` | `/data/portfolio/public` | Node path mounted into `/usr/share/nginx/html` |
| `ingress.host` | `portfolio.example.com` | Ingress hostname |
| `ingress.tls.enabled` | `false` | Enable TLS on the ingress |
| `ingress.tls.secretName` | `portfolio-tls` | TLS secret name (when TLS enabled) |

`[@test] ../helm/portfolio/values.yaml`

## Deployment (`helm/portfolio/templates/deployment.yaml`)

- Replica count from `values.replicaCount`
- Image `{{ image.repository }}:{{ image.tag }}`, pull policy from values
- Port: 80
- Resources (requests & limits) from values
- Liveness probe: HTTP GET `/` port 80, `initialDelaySeconds: 5`, `periodSeconds: 10`
- Readiness probe: HTTP GET `/` port 80, `initialDelaySeconds: 3`, `periodSeconds: 5`
- Rolling update strategy: `maxSurge: 1`, `maxUnavailable: 0`
- `hostPath` volume mounted at `/usr/share/nginx/html` from `values.publicContent.hostPath` (`DirectoryOrCreate`)

`[@test] ../helm/portfolio/templates/deployment.yaml`

## Service (`helm/portfolio/templates/service.yaml`)

- Type: `ClusterIP`
- Port 80 → container port 80
- Selector matches deployment labels

`[@test] ../helm/portfolio/templates/service.yaml`

## Ingress (`helm/portfolio/templates/ingress.yaml`)

- `ingressClassName: nginx`
- Host from `values.ingress.host`
- Routes path `/` (`pathType: Prefix`) to the service on port 80
- Annotations: `nginx.ingress.kubernetes.io/rewrite-target: /`, `ssl-redirect` set from `values.ingress.tls.enabled`
- TLS block rendered only when `values.ingress.tls.enabled` is `true`

`[@test] ../helm/portfolio/templates/ingress.yaml`
