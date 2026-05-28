# DesignXpress AI - Production Deployment Script (Windows)
Write-Host "🚀 DesignXpress AI - Production Deployment" -ForegroundColor Magenta

$ErrorActionPreference = "Stop"

Write-Host "[1/4] Building production images..." -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml build --no-cache

Write-Host "[2/4] Starting production stack..." -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml up -d

Write-Host "[3/4] Waiting for services..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

Write-Host "[4/4] Running database migrations..." -ForegroundColor Cyan
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Production stack is running!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost"
Write-Host "   Backend:  http://localhost/api"
Write-Host ""
Write-Host "Make sure to configure .env.production and your domain + SSL." -ForegroundColor Yellow
