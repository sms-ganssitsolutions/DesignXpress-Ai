# ============================================================
# Apply Recommended Branch Protection Rulesets (Configurable)
# For DesignXpress AI Template
# ============================================================

param(
    [string]$Owner = "YOUR_ORG_OR_USERNAME",
    [string]$Repo = "YOUR_REPO_NAME",
    [string]$ConfigPath = ".github/rulesets/ruleset-config.json"
)

if ($Owner -eq "YOUR_ORG_OR_USERNAME" -or $Repo -eq "YOUR_REPO_NAME") {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\apply-branch-rulesets.ps1 -Owner yourusername -Repo your-repo-name" -ForegroundColor White
    Write-Host ""
    Write-Host "Optional:" -ForegroundColor Yellow
    Write-Host "  -ConfigPath .github/rulesets/ruleset-config.json" -ForegroundColor White
    exit 1
}

if (-not (Test-Path $ConfigPath)) {
    Write-Host "Config file not found: $ConfigPath" -ForegroundColor Red
    exit 1
}

Write-Host "Loading ruleset configuration from $ConfigPath..." -ForegroundColor Cyan
$config = Get-Content $ConfigPath | ConvertFrom-Json

# Build the ruleset payload dynamically from config
$rules = @()

# Always include these protections
$rules += @{ type = "deletion" }
$rules += @{ type = "non_fast_forward" }

# Pull Request rule
if ($config.required_approving_review_count -gt 0) {
    $rules += @{
        type = "pull_request"
        parameters = @{
            required_approving_review_count       = $config.required_approving_review_count
            dismiss_stale_reviews_on_push         = $config.dismiss_stale_reviews_on_push
            require_code_owner_review             = $config.require_code_owner_review
            require_last_push_approval            = $config.require_last_push_approval
            required_review_thread_resolution     = $config.required_review_thread_resolution
        }
    }
}

# Required Status Checks
if ($config.required_status_checks -and $config.required_status_checks.Count -gt 0) {
    $statusChecks = @()
    foreach ($check in $config.required_status_checks) {
        $statusChecks += @{
            context = $check
            integration_id = 15368  # GitHub Actions
        }
    }

    $rules += @{
        type = "required_status_checks"
        parameters = @{
            required_status_checks = $statusChecks
            strict_required_status_checks_policy = $config.strict_required_status_checks
        }
    }
}

# Linear History
if ($config.require_linear_history) {
    $rules += @{ type = "required_linear_history" }
}

# Signed Commits
if ($config.require_signed_commits) {
    $rules += @{ type = "required_signatures" }
}

# Required Workflows (if enabled)
if ($config.required_workflows -and $config.required_workflows.Count -gt 0) {
    $rules += @{
        type = "workflows"
        parameters = @{
            workflows = $config.required_workflows
        }
    }
}

# Merge Queue (optional)
if ($config.enable_merge_queue) {
    $rules += @{
        type = "merge_queue"
        parameters = @{
            check_response_timeout_minutes = 60
            grouping_strategy = "ALLGREEN"
            max_entries_to_build = 5
            merge_method = "MERGE"
            min_entries_to_merge = 1
            min_entries_to_merge_wait_minutes = 5
        }
    }
}

# Final ruleset payload
$rulesetPayload = @{
    name = $config.name
    target = "branch"
    enforcement = $config.enforcement
    conditions = @{
        ref_name = @{
            include = @($config.target_branches)
            exclude = @()
        }
    }
    rules = $rules
} | ConvertTo-Json -Depth 10

Write-Host "Applying ruleset '$($config.name)' to $Owner/$Repo..." -ForegroundColor Cyan

# Try to create the ruleset
$createResponse = gh api `
    --method POST `
    -H "Accept: application/vnd.github+json" `
    "/repos/$Owner/$Repo/rulesets" `
    --input - `
    --silent 2>&1 <<< $rulesetPayload

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Ruleset created successfully!" -ForegroundColor Green
} else {
    Write-Host "Ruleset may already exist. Attempting to update..." -ForegroundColor Yellow
    
    # Find existing ruleset ID
    $existingId = gh api "/repos/$Owner/$Repo/rulesets" --jq ".[] | select(.name == `"$($config.name)`") | .id" 2>$null
    
    if ($existingId) {
        $updateResponse = gh api `
            --method PUT `
            -H "Accept: application/vnd.github+json" `
            "/repos/$Owner/$Repo/rulesets/$existingId" `
            --input - `
            --silent 2>&1 <<< $rulesetPayload
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Ruleset updated successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to update ruleset." -ForegroundColor Red
            Write-Output $updateResponse
            exit 1
        }
    } else {
        Write-Host "❌ Could not create or find existing ruleset." -ForegroundColor Red
        Write-Output $createResponse
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Branch protection ruleset applied!" -ForegroundColor Green
Write-Host "View it here: https://github.com/$Owner/$Repo/settings/rules" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tip: You can customize the rules by editing:" -ForegroundColor Yellow
Write-Host "   .github/rulesets/ruleset-config.json" -ForegroundColor White
