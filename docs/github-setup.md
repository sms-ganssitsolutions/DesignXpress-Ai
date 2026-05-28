# GitHub Repository Setup Guide

This guide explains the recommended GitHub settings when using this repository as a template.

After generating a new repository from this template, we strongly recommend configuring the following for a professional development experience.

## 1. Branch Protection Rules (Highly Recommended)

Go to your repository → **Settings** → **Branches** → **Branch protection rules** → Add rule for `master` (or `main`).

### Recommended Settings for `master` / `main`:

- **Require a pull request before merging**
  - Require approvals: **1** (increase for teams)
  - Dismiss stale pull request approvals when new commits are pushed: **Enabled**
  - Require review from Code Owners: **Enabled** (works with `.github/CODEOWNERS`)

- **Require status checks to pass before merging**
  - Require branches to be up to date before merging: **Enabled**
  - Add these status checks (after first CI run):
    - `Frontend (Next.js)`
    - `Backend (Express + TypeScript)`
    - `Docker Build Check` (optional)

- **Require conversation resolution before merging**: **Enabled**

- **Require signed commits**: Optional (good for security-conscious teams)

- **Do not allow bypassing the above settings**: **Enabled** (for admins too, if desired)

- **Restrict who can push to matching branches**: Optional (recommended for teams)

## 2. CODEOWNERS

This template includes a `.github/CODEOWNERS` file.

### How to customize it:

1. Replace `@your-username` with your GitHub username or team (e.g., `@your-org/frontend-team`).
2. Adjust the paths according to your team structure.

Example:
```codeowners
*                    @your-username
/frontend/           @your-username
/backend/            @your-username
/docs/               @your-username
```

## 3. GitHub Actions / CI

This template includes a basic CI workflow at:

`.github/workflows/ci.yml`

It runs on every push and pull request to `master`/`main` and performs:

- Frontend: Install → Lint → Type check → Build
- Backend: Install → Lint → Type check → Build
- Docker: Basic build verification

### Enabling CI

The workflow should work out of the box. After the first run on your repository:

1. Go to the **Actions** tab.
2. You may need to enable workflows if they are disabled by default.
3. Add the required status checks in your branch protection rules (see above).

### Recommended Enhancements (Already Included in Template)

This template already includes several advanced workflows:

- **Dependabot** (`.github/dependabot.yml`) — Weekly updates for npm (frontend + backend) and GitHub Actions
- **CodeQL** (`.github/workflows/codeql.yml`) — Weekly + on PR/push code scanning
- **Release Workflow** (`.github/workflows/release.yml`) — Automatically creates GitHub Releases on version tags (v*.*.*)
- **Security Scanning** — Trivy filesystem + Docker image scanning in CI
- **Docker Publishing** — Automatically builds and pushes to GitHub Container Registry (GHCR) when a version tag is pushed

You can find all workflows in the `.github/workflows/` directory.

## 4. Repository Settings Recommendations

Go to **Settings** → **General**:

- **Features**
  - Enable **Issues**
  - Enable **Projects** (optional)
  - Enable **Discussions** (optional but recommended for community)

- **Pull Requests**
  - Enable **Allow squash merging** (recommended)
  - Enable **Allow merge commits** (optional)
  - Enable **Allow rebase merging** (optional)

- **Branch** (under "Default branch")
  - Consider renaming `master` → `main` if preferred (GitHub now defaults to `main`)

## 5. Security Features

Go to **Settings** → **Security & analysis**:

- Enable **Dependabot alerts**
- Enable **Dependabot security updates**
- Enable **Code scanning** (CodeQL) – highly recommended
- Enable **Secret scanning**

## 6. After Setup Checklist

- [ ] Set up branch protection on `master` / `main`
- [ ] Customize `.github/CODEOWNERS`
- [ ] Verify GitHub Actions are running
- [ ] Enable all security features
- [ ] Update repository description and topics
- [ ] Add a nice social preview image (Settings → Options)

## Need Help?

See the main [Documentation Hub](../docs/index.md) for more guides.
