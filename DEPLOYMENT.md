# Deployment Guide

This guide covers different deployment strategies for the Leaderboard API.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Migration](#database-migration)
- [Health Checks](#health-checks)

## Docker Deployment

### Local Docker Development

1. **Build and start services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

4. **Remove volumes (reset database)**
   ```bash
   docker-compose down -v
   ```

### Production Docker Deployment

1. **Build production image**
   ```bash
   docker build -t leaderboard-api:latest .
   ```

2. **Run with production environment**
   ```bash
   docker run -d \
     --name leaderboard-api \
     -p 3000:3000 \
     --env-file .env.production \
     leaderboard-api:latest
   ```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Docker registry access

### Deployment Steps

1. **Create namespace**
   ```bash
   kubectl create namespace leaderboard
   ```

2. **Create secrets**
   ```bash
   kubectl create secret generic leaderboard-secrets \
     --from-literal=jwt-secret=your-secret-key \
     --from-literal=db-password=your-db-password \
     -n leaderboard
   ```

3. **Deploy PostgreSQL (using Helm)**
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install postgres bitnami/postgresql \
     --set auth.username=postgres \
     --set auth.password=postgres \
     --set auth.database=leaderboard \
     -n leaderboard
   ```

4. **Apply application deployment**
   ```yaml
   # k8s-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: leaderboard-api
     namespace: leaderboard
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: leaderboard-api
     template:
       metadata:
         labels:
           app: leaderboard-api
       spec:
         containers:
         - name: leaderboard-api
           image: ghcr.io/your-org/leaderboard-api:latest
           ports:
           - containerPort: 3000
           env:
           - name: NODE_ENV
             value: "production"
           - name: DB_HOST
             value: "postgres-postgresql"
           - name: DB_PORT
             value: "5432"
           - name: DB_USERNAME
             value: "postgres"
           - name: DB_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: leaderboard-secrets
                 key: db-password
           - name: JWT_SECRET
             valueFrom:
               secretKeyRef:
                 name: leaderboard-secrets
                 key: jwt-secret
   ```

   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

5. **Create service**
   ```yaml
   # k8s-service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: leaderboard-api
     namespace: leaderboard
   spec:
     selector:
       app: leaderboard-api
     ports:
     - port: 80
       targetPort: 3000
     type: LoadBalancer
   ```

   ```bash
   kubectl apply -f k8s-service.yaml
   ```

## Cloud Deployment

### AWS (ECS/Fargate)

1. **Push image to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker tag leaderboard-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/leaderboard-api:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/leaderboard-api:latest
   ```

2. **Create RDS PostgreSQL instance**
   - Use AWS Console or CLI
   - Note the endpoint and credentials

3. **Create ECS Task Definition**
   - Use the ECR image
   - Set environment variables
   - Configure logging to CloudWatch

4. **Create ECS Service**
   - Use Fargate launch type
   - Configure load balancer
   - Set desired task count

### Google Cloud Platform (Cloud Run)

1. **Build and push to Container Registry**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/leaderboard-api
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy leaderboard-api \
     --image gcr.io/PROJECT_ID/leaderboard-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,DB_HOST=<cloud-sql-instance>
   ```

### Azure (Container Instances)

1. **Push to Azure Container Registry**
   ```bash
   az acr login --name myregistry
   docker tag leaderboard-api:latest myregistry.azurecr.io/leaderboard-api:latest
   docker push myregistry.azurecr.io/leaderboard-api:latest
   ```

2. **Create Container Instance**
   ```bash
   az container create \
     --resource-group myResourceGroup \
     --name leaderboard-api \
     --image myregistry.azurecr.io/leaderboard-api:latest \
     --dns-name-label leaderboard-api \
     --ports 3000 \
     --environment-variables NODE_ENV=production
   ```

## Database Migration

### Running Migrations

**Development:**
```bash
npm run migration:run
```

**Production (Docker):**
```bash
docker exec leaderboard-api npm run migration:run
```

**Production (Kubernetes):**
```bash
kubectl exec -it <pod-name> -n leaderboard -- npm run migration:run
```

### Creating New Migrations

1. **Generate migration**
   ```bash
   npm run migration:generate -- src/migrations/MigrationName
   ```

2. **Review and edit** the generated migration file

3. **Run migration**
   ```bash
   npm run migration:run
   ```

4. **Revert if needed**
   ```bash
   npm run migration:revert
   ```

## Health Checks

### Application Health Check Endpoint

Add this to your application for health monitoring:

```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
```

### Docker Health Check

Already included in `docker-compose.yml` for PostgreSQL:
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Kubernetes Liveness and Readiness Probes

Add to your deployment:
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Monitoring and Logging

### Application Logs

Logs are written to:
- Console (stdout/stderr)
- Files in `logs/` directory (rotated daily)

### Docker Logs

```bash
docker-compose logs -f app
```

### Kubernetes Logs

```bash
kubectl logs -f deployment/leaderboard-api -n leaderboard
```

### Log Aggregation

Consider using:
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **CloudWatch** (AWS)
- **Stackdriver** (GCP)
- **Application Insights** (Azure)

## Scaling Considerations

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

**Docker Compose:**
```bash
docker-compose up -d --scale app=3
```

**Kubernetes:**
```bash
kubectl scale deployment leaderboard-api --replicas=5 -n leaderboard
```

### Database Connection Pooling

Already configured in TypeORM. Adjust pool size based on replica count:

```typescript
// src/config/database.config.ts
extra: {
  max: 20, // Maximum pool size
  min: 5,  // Minimum pool size
}
```

### Caching Layer (Future Enhancement)

For high-traffic scenarios, add Redis:
- Cache leaderboard results
- Cache user profile data
- Session storage

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DB_HOST and credentials
   - Ensure database is running
   - Check network connectivity

2. **JWT token errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure clock sync across servers

3. **Rate limiting too strict**
   - Adjust THROTTLE_LIMIT and THROTTLE_TTL
   - Consider implementing user-specific limits

4. **Performance issues**
   - Add database indexes
   - Implement caching
   - Scale horizontally

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm run start:dev
```

## Security Checklist

- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use secure database passwords
- [ ] Enable database SSL connections
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Implement rate limiting
- [ ] Use environment-specific configs
- [ ] Never commit secrets to git
