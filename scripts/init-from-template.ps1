# ============================================================
# DesignXpress AI - Template Initialization Script (v2 - Aggressive Renaming)
# Run this after generating a new repository from the template
# ============================================================

Write-Host "🚀 Welcome to the DesignXpress AI Template Initializer!" -ForegroundColor Cyan
Write-Host "This script will aggressively rename the project for you." -ForegroundColor Yellow
Write-Host ""

$projectName = Read-Host "Enter your new project name (e.g. MyAwesomeAIStudio)"
$projectSlug = $projectName -replace '\s+', '' -replace '[^a-zA-Z0-9]', ''
$projectSlugLower = $projectSlug.ToLower()
$projectSlugKebab = $projectSlugLower -replace '([a-z])([A-Z])', '$1-$2' -replace '_', '-' | ForEach-Object { $_.ToLower() }

$description = Read-Host "Enter a short description for your project (optional)"

if ([string]::IsNullOrWhiteSpace($description)) {
    $description = "An AI-powered video creation platform"
}

Write-Host ""
Write-Host "Initializing project as '$projectName' ($projectSlug)..." -ForegroundColor Yellow
Write-Host "Using slug: $projectSlugLower" -ForegroundColor DarkGray

# Function to perform safe replacements in a file
function Replace-InFile {
    param (
        [string]$Path,
        [hashtable]$Replacements
    )
    if (Test-Path $Path) {
        $content = Get-Content $Path -Raw
        foreach ($key in $Replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $Replacements[$key]
        }
        Set-Content -Path $Path -Value $content -NoNewline
        Write-Host "  Updated: $Path" -ForegroundColor Green
    }
}

# Define all replacements
$replacements = @{
    "DESIGNXPRESS AI STORY VIDEO STUDIO" = $projectName.ToUpper()
    "DesignXpress AI" = $projectName
    "designxpress-ai-story-video-studio" = $projectSlugLower
    "designxpress-frontend" = "$projectSlugLower-frontend"
    "designxpress-backend" = "$projectSlugLower-backend"
    "designxpress-postgres" = "$projectSlugLower-postgres"
    "designxpress-redis" = "$projectSlugLower-redis"
    "designxpress-pgadmin" = "$projectSlugLower-pgadmin"
    "designxpress-postgres-prod" = "$projectSlugLower-postgres-prod"
    "designxpress-redis-prod" = "$projectSlugLower-redis-prod"
    "designxpress-backend-prod" = "$projectSlugLower-backend-prod"
    "designxpress-frontend-prod" = "$projectSlugLower-frontend-prod"
    "designxpress-pgadmin-prod" = "$projectSlugLower-pgadmin-prod"
    "designxpress_ai" = $projectSlugLower
    "designxpress" = $projectSlugLower
}

# Update package.json files
Replace-InFile -Path "package.json" -Replacements $replacements
Replace-InFile -Path "frontend/package.json" -Replacements $replacements
Replace-InFile -Path "backend/package.json" -Replacements $replacements

# Update Docker Compose files
Replace-InFile -Path "docker-compose.yml" -Replacements $replacements
Replace-InFile -Path "docker-compose.prod.yml" -Replacements $replacements

# Update environment files
Replace-InFile -Path ".env.example" -Replacements $replacements
Replace-InFile -Path ".env.production.example" -Replacements $replacements
Replace-InFile -Path "backend/.env.example" -Replacements $replacements

# Update README and documentation
Replace-InFile -Path "README.md" -Replacements $replacements
Replace-InFile -Path "TEMPLATE.md" -Replacements $replacements
Replace-InFile -Path "CHANGELOG.md" -Replacements $replacements

# Update all docs
Get-ChildItem -Path "docs" -Filter "*.md" -Recurse | ForEach-Object {
    Replace-InFile -Path $_.FullName -Replacements $replacements
}

# Update scripts (except this one)
Get-ChildItem -Path "scripts" -Filter "*.ps1" | Where-Object { $_.Name -ne "init-from-template.ps1" } | ForEach-Object {
    Replace-InFile -Path $_.FullName -Replacements $replacements
}

# Create .env from example if it doesn't exist
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env" -Force
    Write-Host "  Created: .env from .env.example" -ForegroundColor Green
}

if (-not (Test-Path "backend/.env") -and (Test-Path "backend/.env.example")) {
    Copy-Item "backend/.env.example" "backend/.env" -Force
    Write-Host "  Created: backend/.env from example" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Aggressive project renaming complete!" -ForegroundColor Green
Write-Host ""
Write-Host "What was updated:" -ForegroundColor Cyan
Write-Host "  - Package names (root, frontend, backend)"
Write-Host "  - Docker container & service names"
Write-Host "  - Database name references"
Write-Host "  - README, TEMPLATE.md, and all documentation"
Write-Host "  - Environment example files"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and update branding (logo in frontend/public/)"
Write-Host "2. Add your own API keys to .env and backend/.env"
Write-Host "3. Run: .\scripts\install.ps1"
Write-Host "4. Run: .\scripts\setup.ps1"
Write-Host "5. (Optional) Delete release-related files if not needed"
Write-Host ""
Write-Host "Happy building with your new project: $projectName 🎉" -ForegroundColor Magenta
