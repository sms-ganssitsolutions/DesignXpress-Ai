# GitHub Repository Setup Guide

This guide explains the recommended GitHub settings when using this repository as a template.

After generating a new repository from this template, we strongly recommend configuring the following for a professional development experience.

## 1. Branch Protection using Repository Rulesets (Recommended)

GitHub now recommends **Repository Rulesets** over the older "Branch protection rules". Rulesets are more powerful and flexible.

### Why Use Rulesets?
- Work on all branches (including future ones via patterns)
- Support advanced rules like **Required linear history**, **Required signatures**, and more
- Can be applied at organization level
- Better audit logging

### Recommended Ruleset for `main` / `master`

This template includes a ready-to-use ruleset definition at:

**`.github/rulesets/main-branch-protection.json`**

It includes:
- No deletions
- No force pushes
- Require pull request with at least 1 approval
- Require Code Owner review
- Require status checks from our CI workflows
- Require linear history
- Require signed commits

### How to Apply the Ruleset (Recommended)

The template now supports a **configurable** ruleset system.

#### Option A: Using the Config + Script (Easiest & Recommended)

1. Edit `.github/rulesets/ruleset-config.json` to customize:
   - Number of required approvals
   - Which status checks are required
   - Whether to require linear history, signed commits, etc.

2. Run the script:

   **Windows:**
   ```powershell
   .\scripts\apply-branch-rulesets.ps1 -Owner yourusername -Repo your-repo-name
   ```

   **macOS / Linux:**
   ```bash
   ./scripts/apply-branch-rulesets.sh yourusername your-repo-name
   ```

#### Option B: Using the Static JSON (Simple)
```bash
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/OWNER/REPO/rulesets \
  --input .github/rulesets/main-branch-protection.json
```

#### Option C: Manual via GitHub UI
Go to **Settings → Rules → Rulesets** and create a new branch ruleset with your desired protections.

After applying, you can view and manage all rulesets at:
`https://github.com/OWNER/REPO/settings/rules`

### Important Status Checks to Require

Make sure these checks from `.github/workflows/ci.yml` are required:
- `Frontend (Next.js)`
- `Backend (Express + TypeScript)`
- `Docker Build Check`
- `Security Scan` (from Trivy)

These come from the CI workflows included in this template.

---

## Organization-Level Rulesets (Advanced)

If you are in a GitHub organization, you can apply rulesets at the **organization level** so they automatically apply to all repositories (or specific ones).

### Example: Create an Org-Level Ruleset

1. Go to your organization → **Settings** → **Rules** → **Rulesets**
2. Click **"New ruleset"** → **"New organization ruleset"**
3. Use the same rules as in `.github/rulesets/main-branch-protection.json`
4. Under **Repositories**, choose:
   - All repositories, or
   - Only repositories matching a pattern (e.g. `*-ai-*`)

This is especially powerful for companies that want consistent branch protection across many repositories.

You can also manage org-level rulesets via the GitHub API or `gh` CLI.

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

This template ships with a rich set of GitHub-native DevOps features:

**Core CI/CD**
- **CI** — Full lint, type check, build, Trivy security scanning, and Docker validation
- **CodeQL** — Advanced code scanning (weekly + on PR/push)
- **Merge Queue** — Ready for GitHub Merge Queues
- **Release** — Automatic GitHub Releases on version tags (`v*.*.*`)

**Automation**
- **Dependabot** — Weekly dependency updates for npm and GitHub Actions
- **Dependabot Auto-Merge** — Automatically merges minor and patch updates
- **Renovate** (`renovate.json`) — Powerful alternative to Dependabot with advanced grouping and scheduling
- **Stale Bot** — Automatically closes stale issues and PRs
- **PR Auto-Labeler** — Automatically labels PRs based on changed paths

**Security & Scanning**
- **CodeQL** — Advanced semantic code analysis
- **Trivy Docker Security Scanning** — Dedicated workflow for container vulnerability scanning (filesystem + image)

**Reusable & Advanced**
- Example reusable workflow (`reusable-ci.yml`)
- Configurable branch protection via rulesets (see below)
- Merge Queue support
- Automated releases on version tags

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
