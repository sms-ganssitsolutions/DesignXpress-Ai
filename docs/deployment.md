# Cloud Deployment Guide for DesignXpress AI Story Video Studio

## 1. Railway (Fastest & Recommended for Startups)

1. Push your code to GitHub.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub.
3. Add services:
   - PostgreSQL (plugin)
   - Redis (plugin)
   - Backend (use Dockerfile.prod or Nixpacks)
   - Frontend (use Dockerfile.prod)
4. Set environment variables from `.env.production.example`.
5. Add a custom domain if desired.
6. FFmpeg: Railway containers usually have it, or install via build step.

**Pro tip**: Use the production Dockerfiles provided.

## 2. AWS (Production Scale)

### Recommended Architecture
- **Frontend**: Amplify or ECS Fargate + CloudFront
- **Backend**: ECS Fargate or App Runner
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Cache**: ElastiCache Redis
- **Storage**: S3 for uploads/exports
- **FFmpeg**: Run inside backend containers (or use Lambda + MediaConvert for heavy rendering)

### Quick ECS Steps
1. Create ECR repositories for frontend and backend.
2. Build and push using the prod Dockerfiles.
3. Create ECS Cluster + Services.
4. Use Application Load Balancer.
5. Attach RDS and ElastiCache.
6. Set up S3 bucket for uploads with proper CORS.

## 3. Other Options

- **Render.com**: Very similar to Railway, great free tier.
- **Vercel + Supabase**: For frontend on Vercel, move backend + DB to Supabase or Railway.
- **DigitalOcean App Platform** or **Fly.io**.

## 4. Important Production Notes

- Always use strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Enable proper CORS
- Use a real object storage (S3 / Spaces) for uploads instead of local `./uploads`
- For heavy video rendering at scale, offload FFmpeg to a separate worker queue (BullMQ already prepared)
- Add monitoring (Sentry, Datadog, etc.)

## 5. Environment Variables Checklist

Copy from `.env.production.example` and fill in real secrets.

---

Last updated: 2026
