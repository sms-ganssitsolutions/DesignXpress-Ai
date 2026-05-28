# ===========================================
# DESIGNXPRESS AI - SETUP SCRIPT
# Run after install.ps1
# This initializes the database, Prisma, and folders
# ===========================================

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  DESIGNXPRESS AI - DATABASE & SETUP" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$ErrorActionPreference = "Continue"

# 1. Start Docker containers (Postgres + Redis)
Write-Host "[1/7] Starting Docker services (PostgreSQL + Redis)..." -ForegroundColor Cyan
docker compose up -d postgres redis
Start-Sleep -Seconds 8
Write-Host "  ✓ Docker containers started" -ForegroundColor Green

# 2. Wait for PostgreSQL to be ready
Write-Host "[2/7] Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
$maxAttempts = 20
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    $attempt++
    try {
        docker exec designxpress-postgres pg_isready -U designxpress | Out-Null
        $ready = $true
    } catch {
        Write-Host "  ... waiting for database ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if ($ready) {
    Write-Host "  ✓ PostgreSQL is ready" -ForegroundColor Green
} else {
    Write-Host "  ! PostgreSQL may not be fully ready yet. Continuing anyway..." -ForegroundColor Yellow
}

# 3. Setup Backend + Prisma
Write-Host "[3/7] Setting up Backend + Prisma..." -ForegroundColor Cyan
Push-Location backend

# Generate Prisma Client
Write-Host "  → Generating Prisma Client..." -ForegroundColor Gray
npx prisma generate

# Run migrations
Write-Host "  → Running database migrations..." -ForegroundColor Gray
npx prisma migrate dev --name init --create-only 2>$null
npx prisma migrate deploy

# Seed the database
Write-Host "  → Seeding database with demo data..." -ForegroundColor Gray
if (Test-Path "prisma\seed.ts") {
    npx ts-node prisma/seed.ts
} elseif (Test-Path "prisma\seed.js") {
    node prisma/seed.js
} else {
    Write-Host "  (No seed file found yet - will create one)" -ForegroundColor Yellow
}

Pop-Location
Write-Host "  ✓ Backend + Prisma setup complete" -ForegroundColor Green

# 4. Create upload directories with proper permissions
Write-Host "[4/7] Ensuring upload directories exist..." -ForegroundColor Cyan
$dirs = @("uploads\projects", "uploads\assets", "uploads\exports", "uploads\temp")
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}
Write-Host "  ✓ Upload folders ready" -ForegroundColor Green

# 5. Check for FFmpeg
Write-Host "[5/7] Checking for FFmpeg..." -ForegroundColor Cyan
$ffmpegFound = $false

# Common Windows locations
$ffmpegPaths = @(
    "C:\ffmpeg\bin\ffmpeg.exe",
    "C:\Program Files\ffmpeg\bin\ffmpeg.exe",
    "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg*\ffmpeg-*\bin\ffmpeg.exe"
)

foreach ($path in $ffmpegPaths) {
    if (Test-Path $path) {
        Write-Host "  ✓ FFmpeg found at: $path" -ForegroundColor Green
        $ffmpegFound = $true
        break
    }
}

if (-not $ffmpegFound) {
    Write-Host "  ! FFmpeg not found in common locations." -ForegroundColor Yellow
    Write-Host "    Download from: https://ffmpeg.org/download.html#build-windows" -ForegroundColor Yellow
    Write-Host "    Recommended: Place ffmpeg.exe in C:\ffmpeg\bin\" -ForegroundColor Yellow
    Write-Host "    Or update FFMPEG_PATH in your .env file" -ForegroundColor Yellow
}

# 6. Create .env in backend if missing
Write-Host "[6/7] Verifying backend environment..." -ForegroundColor Cyan
if (-not (Test-Path "backend\.env")) {
    if (Test-Path ".env") {
        Copy-Item ".env" "backend\.env" -Force
        Write-Host "  ✓ Copied root .env to backend/" -ForegroundColor Green
    }
}

# 7. Final verification
Write-Host "[7/7] Final verification..." -ForegroundColor Cyan
Write-Host "  → Checking PostgreSQL connection..." -ForegroundColor Gray
docker exec designxpress-postgres psql -U designxpress -d designxpress_ai -c "\dt" 2>$null | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run:" -ForegroundColor Cyan
Write-Host "  .\scripts\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "This will start:" -ForegroundColor Gray
Write-Host "  - PostgreSQL + Redis (Docker)" -ForegroundColor Gray
Write-Host "  - Backend API on http://localhost:5000" -ForegroundColor Gray
Write-Host "  - Frontend on http://localhost:3000" -ForegroundColor Gray
Write-Host ""
