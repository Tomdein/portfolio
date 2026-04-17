---
name: Kubernetes Deployment
description: K8s manifests for deploying the portfolio container
targets:
  - ../k8s/deployment.yaml
  - ../k8s/service.yaml
  - ../k8s/ingress.yaml
---

# Kubernetes Deployment

Kubernetes manifests to deploy the Nginx-based portfolio container.

## Namespace

- All resources use a configurable namespace (default: `portfolio`)
- Manifests include namespace field for clarity

## Deployment (`k8s/deployment.yaml`)

- 2 replicas for availability
- Container image: `ghcr.io/<owner>/portfolio:latest` (placeholder for user's registry)
- Port: 80
- Resource limits: CPU 100m / Memory 128Mi
- Liveness probe: HTTP GET on `/` port 80
- Readiness probe: HTTP GET on `/` port 80
- Rolling update strategy: `maxSurge: 1`, `maxUnavailable: 0`

`[@test] ../k8s/deployment.yaml`

## Service (`k8s/service.yaml`)

- Type: `ClusterIP`
- Port 80 → container port 80
- Selector matches deployment labels

`[@test] ../k8s/service.yaml`

## Ingress (`k8s/ingress.yaml`)

- Ingress resource with placeholder host (e.g., `portfolio.example.com`)
- Routes `/` to the service on port 80
- Annotations for common ingress controllers (nginx-ingress)
- TLS section included but commented out for user to configure

`[@test] ../k8s/ingress.yaml`
