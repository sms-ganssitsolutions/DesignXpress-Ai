# =====================================================
# DesignXpress AI - Release v1.0-documentation-complete
# Ready-to-run PowerShell script
# =====================================================

Write-Host "=== DesignXpress AI Release Commands ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Run this script (or the commands below) on a machine where:" -ForegroundColor Yellow
Write-Host "  - You have GitHub CLI (gh) installed and authenticated" -ForegroundColor Yellow
Write-Host "  - You have write access to sms-ganssitsolutions/DesignXpress-Ai" -ForegroundColor Yellow
Write-Host ""

# Option 1: Create as DRAFT (Recommended first)
Write-Host "1. Create Release as DRAFT (safest):" -ForegroundColor Green
Write-Host @'
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft
'@ -ForegroundColor White

Write-Host ""
Write-Host "After reviewing on GitHub, you can publish the draft from the web UI." -ForegroundColor Gray
Write-Host ""

# Option 2: Non-draft (publishes immediately)
Write-Host "2. NON-DRAFT version (publishes immediately):" -ForegroundColor Red
Write-Host @'
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md
'@ -ForegroundColor White

Write-Host ""
Write-Host "3. Using the short one-paragraph description (Non-Draft):" -ForegroundColor Magenta
Write-Host @'
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes "v1.0-documentation-complete delivers a complete, professional documentation suite for DesignXpress AI Story Video Studio. This release introduces a central Documentation Hub, a dedicated diagrams collection with rich Mermaid visualizations (AI flows, media pipeline, export queue, data models, and collaboration), multiple new specialized guides (workflows, FAQ, testing, performance, security, and more), and a single-file consolidated guide optimized for PDF export — significantly improving discoverability and usability across the entire project."
'@ -ForegroundColor White

Write-Host ""
Write-Host "=== End of commands ===" -ForegroundColor Cyan
Write-Host "Copy and paste the block you want to use into your terminal." -ForegroundColor Gray
