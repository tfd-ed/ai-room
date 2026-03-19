# Kubernetes Deployment for AI ML Room

This directory contains Kubernetes manifests for deploying the AI ML Room application.

## Structure

```
k8s/
├── namespaces.yaml          # Namespace definitions (dev, prod)
└── prod/
    ├── deployment.yaml      # Production deployment
    ├── service.yaml         # ClusterIP service
    └── ingress.yaml         # Nginx ingress with TLS
```

## Prerequisites

- Kubernetes cluster with nginx-ingress-controller installed
- kubectl configured to access your cluster
- Docker registry at `registry.homelab.local` (or update image URLs)
- cert-manager installed for automatic TLS certificates (optional)

## Deployment

### Manual Deployment

```bash
# Apply namespaces
kubectl apply -f namespaces.yaml

# Apply production manifests
kubectl apply -f prod/service.yaml
kubectl apply -f prod/deployment.yaml
kubectl apply -f prod/ingress.yaml
```

### Automated Deployment (CI/CD)

The GitHub Actions workflow in `.github/workflows/deploy-prod.yml` automatically:

1. Builds Docker image
2. Pushes to registry
3. Deploys to Kubernetes
4. Updates deployment with new image
5. Waits for rollout completion

Triggers on:
- Push to `master` or `main` branch
- Manual workflow dispatch

## Configuration

### Deployment Specs

- **Replicas**: 2
- **Image**: `registry.homelab.local/ai-ml-room:latest`
- **Port**: 3000
- **Strategy**: RollingUpdate (maxSurge: 1, maxUnavailable: 0)
- **Resources**:
  - Requests: 100m CPU, 256Mi memory
  - Limits: 500m CPU, 512Mi memory

### Health Checks

- **Liveness Probe**: HTTP GET `/` on port 3000
  - initialDelaySeconds: 30
  - periodSeconds: 10
  - timeoutSeconds: 5
  - failureThreshold: 3

- **Readiness Probe**: HTTP GET `/` on port 3000
  - initialDelaySeconds: 10
  - periodSeconds: 5
  - timeoutSeconds: 3
  - failureThreshold: 3

### Environment Variables

- `NODE_ENV`: production
- `HOST`: 0.0.0.0
- `PORT`: 3000

### Ingress

- **Host**: `ai-ml.tfdevs.com`
- **TLS**: Enabled (cert-manager with letsencrypt-prod)
- **Certificate Secret**: `ai-ml-room-tls`

## Monitoring

Check deployment status:

```bash
# Get pods
kubectl get pods -n prod -l app=ai-ml-room

# Get service
kubectl get svc -n prod ai-ml-room-service

# Get ingress
kubectl get ingress -n prod ai-ml-room-ingress

# Check logs
kubectl logs -n prod -l app=ai-ml-room --tail=100 -f

# Describe deployment
kubectl describe deployment ai-ml-room-prod -n prod
```

## Rollback

If a deployment fails, rollback to previous version:

```bash
kubectl rollout undo deployment/ai-ml-room-prod -n prod

# Check rollout status
kubectl rollout status deployment/ai-ml-room-prod -n prod

# View rollout history
kubectl rollout history deployment/ai-ml-room-prod -n prod
```

## Scaling

Scale replicas:

```bash
kubectl scale deployment ai-ml-room-prod --replicas=3 -n prod
```

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pods -n prod -l app=ai-ml-room

# Check logs
kubectl logs -n prod -l app=ai-ml-room --all-containers=true
```

### ImagePullBackOff

Verify:
- Registry is accessible from cluster
- Image exists: `docker pull registry.homelab.local/ai-ml-room:latest`
- Image pull secrets configured (if registry requires authentication)

### DNS/Ingress not working

```bash
# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Verify ingress
kubectl describe ingress -n prod ai-ml-room-ingress

# Check TLS certificate
kubectl get certificate -n prod
kubectl describe certificate ai-ml-room-tls -n prod
```

## URLs

- **Production**: https://ai-ml.tfdevs.com
