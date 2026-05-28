# ===========================================
# DESIGNXPRESS AI STORY VIDEO STUDIO
# START SCRIPT - Windows PowerShell
# ===========================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   DESIGNXPRESS AI STORY VIDEO STUDIO                       ║" -ForegroundColor Magenta
Write-Host "║   Where Innovation Meets Excellence                        ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$ErrorActionPreference = "Continue"

# Ensure Docker services are running
Write-Host "[1/5] Starting infrastructure (PostgreSQL + Redis)..." -ForegroundColor Cyan
docker compose up -d postgres redis pgadmin 2>$null
Start-Sleep -Seconds 3

# Start Backend
Write-Host "[2/5] Starting Backend API (Express + TypeScript)..." -ForegroundColor Cyan
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 4

# Start Frontend
Write-Host "[3/5] Starting Frontend (Next.js 15)..." -ForegroundColor Cyan
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 6

# Open browser
Write-Host "[4/5] Opening application in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

# Show status
Write-Host "[5/5] All services starting..." -ForegroundColor Cyan
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  DESIGNXPRESS AI IS RUNNING" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend:      " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend API:   " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host "  PgAdmin:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Database:      " -NoNewline -ForegroundColor White
Write-Host "localhost:5432 (designxpress_ai)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Login with demo account:" -ForegroundColor Yellow
Write-Host "    Email:    demo@designxpress.ai" -ForegroundColor Gray
Write-Host "    Password: demo123456" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in the backend/frontend windows to stop services." -ForegroundColor DarkGray
Write-Host ""
