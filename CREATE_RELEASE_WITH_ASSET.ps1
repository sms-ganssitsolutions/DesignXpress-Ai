# ============================================================
# DesignXpress AI - Create Release v1.0-documentation-complete
# WITH Consolidated Guide attached as an asset
# ============================================================

Write-Host "=== Release v1.0-documentation-complete with Asset ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script prepares commands to:" -ForegroundColor Yellow
Write-Host "  1. Create the GitHub Release" -ForegroundColor Yellow
Write-Host "  2. Attach the consolidated guide as a downloadable asset" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run these on a machine with 'gh' authenticated and write access." -ForegroundColor Gray
Write-Host ""

# ============================================================
# OPTION 1: Draft Release + Upload Asset (RECOMMENDED)
# ============================================================
Write-Host "=== OPTION 1: Create as DRAFT + Upload Asset ===" -ForegroundColor Green
Write-Host @'
# Step 1: Create the release as a draft
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft

# Step 2: Attach the consolidated guide as an asset
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
'@ -ForegroundColor White

Write-Host ""
Write-Host "After running the above, go to GitHub and publish the draft when ready." -ForegroundColor Gray
Write-Host ""

# ============================================================
# OPTION 2: Non-Draft (Publishes Immediately) + Upload Asset
# ============================================================
Write-Host "=== OPTION 2: NON-DRAFT (Publishes Immediately) + Upload Asset ===" -ForegroundColor Red
Write-Host @'
# Step 1: Create and publish the release
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md

# Step 2: Attach the consolidated guide as an asset
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
'@ -ForegroundColor White

Write-Host ""

# ============================================================
# OPTION 3: Using Short One-Paragraph Description + Asset
# ============================================================
Write-Host "=== OPTION 3: Short Description + Upload Asset (Non-Draft) ===" -ForegroundColor Magenta
Write-Host @'
# Step 1: Create the release with the short description
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes "v1.0-documentation-complete delivers a complete, professional documentation suite for DesignXpress AI Story Video Studio. This release introduces a central Documentation Hub, a dedicated diagrams collection with rich Mermaid visualizations (AI flows, media pipeline, export queue, data models, and collaboration), multiple new specialized guides (workflows, FAQ, testing, performance, security, and more), and a single-file consolidated guide optimized for PDF export — significantly improving discoverability and usability across the entire project."

# Step 2: Attach the consolidated guide
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
'@ -ForegroundColor White

Write-Host ""
Write-Host "=== Tips ===" -ForegroundColor Cyan
Write-Host "- The asset will appear as a downloadable file on the GitHub release page." -ForegroundColor Gray
Write-Host "- You can rename the asset on upload if you want a shorter filename:" -ForegroundColor Gray
Write-Host '  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md:DesignXpress_AI_Complete_Guide.md' -ForegroundColor White
Write-Host ""
Write-Host "Example with renamed asset:" -ForegroundColor Gray
Write-Host @'
gh release upload v1.0-documentation-complete `
  "docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md:DesignXpress_AI_Complete_Guide.md" `
  --repo sms-ganssitsolutions/DesignXpress-Ai
'@ -ForegroundColor White
Write-Host ""
Write-Host "Done!" -ForegroundColor Green

# ============================================================
# OPTION 4: Short Description + Multiple Assets (Non-Draft)
# ============================================================
Write-Host ""
Write-Host "=== OPTION 4: Short Description + Multiple Assets (Non-Draft) ===" -ForegroundColor Cyan
Write-Host @'
# Step 1: Create the release using the short description
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes "v1.0-documentation-complete delivers a complete, professional documentation suite for DesignXpress AI Story Video Studio. This release introduces a central Documentation Hub, a dedicated diagrams collection with rich Mermaid visualizations (AI flows, media pipeline, export queue, data models, and collaboration), multiple new specialized guides (workflows, FAQ, testing, performance, security, and more), and a single-file consolidated guide optimized for PDF export — significantly improving discoverability and usability across the entire project."

# Step 2: Attach multiple useful files as assets
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  RELEASE_v1.0-documentation-complete.md `
  docs/RELEASE_COMMANDS.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
'@ -ForegroundColor White

Write-Host ""
Write-Host "This version gives users the short description in the release body + the most important files as downloadable assets." -ForegroundColor Gray

# ============================================================
# OPTION 5: Full Notes + Multiple Assets (Non-Draft)
# ============================================================
Write-Host ""
Write-Host "=== OPTION 5: Full Notes File + Multiple Assets (Non-Draft) ===" -ForegroundColor DarkCyan
Write-Host @'
# Step 1: Create the release using the full notes file
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md

# Step 2: Attach the consolidated guide + supporting files
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  RELEASE_DESCRIPTION_SHORT.md `
  docs/RELEASE_COMMANDS.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
'@ -ForegroundColor White

Write-Host ""
Write-Host "=== Asset Rename Examples ===" -ForegroundColor Yellow
Write-Host "You can give assets nicer names when uploading:" -ForegroundColor Gray
Write-Host @'
gh release upload v1.0-documentation-complete `
  "docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md:DesignXpress_AI_Complete_Guide.md" `
  "RELEASE_v1.0-documentation-complete.md:Full_Release_Notes.md" `
  --repo sms-ganssitsolutions/DesignXpress-Ai
'@ -ForegroundColor White
Write-Host ""
Write-Host "All done! Choose the option that best fits your preference." -ForegroundColor Green
