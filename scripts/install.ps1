# ===========================================
# DESIGNXPRESS AI - INSTALLATION SCRIPT
# Run this first on a fresh clone
# ===========================================

Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  DESIGNXPRESS AI STORY VIDEO STUDIO" -ForegroundColor Magenta
Write-Host "  Windows Installation Script" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$ErrorActionPreference = "Stop"

# 1. Check Node.js
Write-Host "[1/8] Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Check npm
Write-Host "[2/8] Checking npm..." -ForegroundColor Cyan
$npmVersion = npm --version
Write-Host "  ✓ npm found: $npmVersion" -ForegroundColor Green

# 3. Check Docker
Write-Host "[3/8] Checking Docker Desktop..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "  ✓ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "  ! Docker not found. Please install Docker Desktop for Windows." -ForegroundColor Yellow
    Write-Host "    Download: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
}

# 4. Install root dependencies (if any)
Write-Host "[4/8] Installing root dependencies..." -ForegroundColor Cyan
if (Test-Path "package.json") {
    npm install
} else {
    Write-Host "  (No root package.json yet - skipping)" -ForegroundColor Gray
}

# 5. Install Frontend dependencies
Write-Host "[5/8] Installing Frontend (Next.js) dependencies..." -ForegroundColor Cyan
Push-Location frontend
npm install
Pop-Location
Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green

# 6. Install Backend dependencies
Write-Host "[6/8] Installing Backend (Express) dependencies..." -ForegroundColor Cyan
Push-Location backend
npm install
Pop-Location
Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green

# 7. Copy environment files
Write-Host "[7/8] Setting up environment files..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env" -Force
    Write-Host "  ✓ Created .env from .env.example" -ForegroundColor Green
} else {
    Write-Host "  ( .env already exists - keeping existing file )" -ForegroundColor Yellow
}

if (-not (Test-Path "frontend\.env.local")) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="DesignXpress AI Story Video Studio"
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "  ✓ Created frontend/.env.local" -ForegroundColor Green
}

# 8. Create necessary upload directories
Write-Host "[8/8] Creating upload directories..." -ForegroundColor Cyan
$uploadDirs = @("uploads", "uploads/projects", "uploads/assets", "uploads/exports", "uploads/temp")
foreach ($dir in $uploadDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}
Write-Host "  ✓ Upload directories ready" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Edit .env with your API keys (OpenAI, ElevenLabs, etc.)" -ForegroundColor White
Write-Host "  2. Run:  .\scripts\setup.ps1" -ForegroundColor White
Write-Host "  3. Run:  .\scripts\start.ps1" -ForegroundColor White
Write-Host ""
