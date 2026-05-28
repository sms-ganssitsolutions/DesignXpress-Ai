# Cloud Deployment Guide for DesignXpress AI Story Video Studio

## 1. Railway (Fastest & Recommended - Accurate Steps)

**Prerequisites**: GitHub repo with your code pushed.

1. Go to https://railway.app → Sign up with GitHub.
2. Click "New Project" → "Deploy from GitHub Repo".
3. Select your repo.
4. Railway will detect services. Manually add:
   - **PostgreSQL** (Add Plugin → PostgreSQL)
   - **Redis** (Add Plugin → Redis)
5. For Backend:
   - Create new service → GitHub → select repo, root directory = `backend`
   - Use `Dockerfile.prod` if available, or let it auto-detect.
   - Set environment variables (from `.env.production.example`):
     - DATABASE_URL (copy from Railway Postgres plugin)
     - REDIS_URL (copy from Redis plugin)
     - JWT_SECRET=your-long-random-string
     - OPENAI_API_KEY, ELEVENLABS_API_KEY, etc.
6. For Frontend:
   - New service → GitHub → root directory = `frontend`
   - Set NEXT_PUBLIC_API_URL to your backend public URL (e.g. https://your-backend.up.railway.app)
7. In backend service, add a start command if needed: `node dist/index.js`
8. Deploy. Railway gives you public URLs automatically.
9. For FFmpeg on Railway: It may not be pre-installed. Add a build step or use a custom image. For production video rendering, consider offloading to a separate worker.

**Error Handling Tip**: Monitor logs in Railway dashboard. The backend includes `/health` endpoint for basic checks.

**Common Issues**:
- Database connection: Make sure DATABASE_URL uses the internal Railway URL during build if needed.
- Large file uploads: Increase limits or use S3 / Cloud storage.
- FFmpeg not available: Video exports will fall back or fail. Consider using a custom Railway template with FFmpeg pre-installed or offload rendering.

This setup is functional as of 2026 with proper env vars.

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
