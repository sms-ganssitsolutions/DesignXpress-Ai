# Release v1.0-documentation-complete - Commands

## 1. Push the Tag and Commits (Run on your machine with proper auth)

```powershell
# Make sure you are on the correct commit
git checkout master
git pull origin master

# Push latest commits
git push origin master

# Push the documentation tag
git push origin v1.0-documentation-complete
```

## 2. Create GitHub Release using gh CLI (Recommended)

Make sure you have the GitHub CLI (`gh`) installed and authenticated with write access to the repository.

### Non-Draft Version (publishes the release immediately)
```powershell
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md
```

### Draft Version (recommended first - publish later from GitHub)
```powershell
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft
```

### Using the Short One-Paragraph Description (Non-Draft)
```powershell
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes "v1.0-documentation-complete delivers a complete, professional documentation suite for DesignXpress AI Story Video Studio. This release introduces a central Documentation Hub, a dedicated diagrams collection with rich Mermaid visualizations (AI flows, media pipeline, export queue, data models, and collaboration), multiple new specialized guides (workflows, FAQ, testing, performance, security, and more), and a single-file consolidated guide optimized for PDF export — significantly improving discoverability and usability across the entire project."
```

Then go to GitHub to publish when ready.

## 3. Manual Release (No gh CLI)

1. Go to: https://github.com/sms-ganssitsolutions/DesignXpress-Ai/releases/new
2. Choose tag: `v1.0-documentation-complete`
3. Release title: `v1.0-documentation-complete`
4. Paste the content from `RELEASE_v1.0-documentation-complete.md` (or the short description below)
5. Publish release

---

**Note**: The remote push and release creation must be done from an account that has write permissions to `sms-ganssitsolutions/DesignXpress-Ai`.

## 4. Create Release + Attach Consolidated Guide as an Asset (with Short Description + Multi-file)

### Short Description + Multiple Assets (Non-Draft)
```powershell
# Step 1: Create the release using the short one-paragraph description
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes "v1.0-documentation-complete delivers a complete, professional documentation suite for DesignXpress AI Story Video Studio. This release introduces a central Documentation Hub, a dedicated diagrams collection with rich Mermaid visualizations (AI flows, media pipeline, export queue, data models, and collaboration), multiple new specialized guides (workflows, FAQ, testing, performance, security, and more), and a single-file consolidated guide optimized for PDF export — significantly improving discoverability and usability across the entire project."

# Step 2: Attach the consolidated guide + other useful files
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  RELEASE_v1.0-documentation-complete.md `
  docs/RELEASE_COMMANDS.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
```

### Full Notes File + Multiple Assets (Non-Draft)
```powershell
# Step 1: Create using the full notes file
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md

# Step 2: Attach multiple files
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  RELEASE_DESCRIPTION_SHORT.md `
  docs/RELEASE_COMMANDS.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
```

See the root script `CREATE_RELEASE_WITH_ASSET.ps1` for the complete set of ready-to-run variants (Draft + Asset, Short + Multi, etc.).

## 4. Create Release + Attach Consolidated Guide as an Asset

### Recommended: Draft + Upload Asset
```powershell
# Step 1: Create as draft
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft

# Step 2: Attach the full consolidated guide
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
```

### Non-Draft + Upload Asset
```powershell
# Step 1: Create and publish
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md

# Step 2: Attach the asset
gh release upload v1.0-documentation-complete `
  docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
```

### Tip: Rename the asset for cleaner download name
```powershell
gh release upload v1.0-documentation-complete `
  "docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md:DesignXpress_AI_Complete_Guide.md" `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --clobber
```

See also the helper script `CREATE_RELEASE_WITH_ASSET.ps1` in the repository root for all variants in one place.
