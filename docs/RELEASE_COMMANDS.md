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

```powershell
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft=false
```

### Alternative: Create as Draft First (for review)

```powershell
gh release create v1.0-documentation-complete `
  --repo sms-ganssitsolutions/DesignXpress-Ai `
  --title "v1.0-documentation-complete" `
  --notes-file RELEASE_v1.0-documentation-complete.md `
  --draft
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
