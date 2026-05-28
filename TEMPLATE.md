# Using This Repository as a Template

```
  ____            _               __  __                     
 |  _ \  ___  ___(_) __ _ _ __   \ \/ / _ __  _ __ ___  ___ 
 | | | |/ _ \/ __| |/ _` | '_ \   \  / | '_ \| '__/ _ \/ __|
 | |_| |  __/\__ \ | (_| | | | |  /  \ | |_) | | |  __/\__ \
 |____/ \___||___/_|\__, |_| |_| /_/\_\| .__/|_|  \___||___/
                    |___/              |_|                  
```

**DesignXpress AI Story Video Studio - Template Repository**

Thank you for using **DesignXpress AI** as a template!

This repository is designed to be used as a **GitHub Template Repository**. When you click **"Use this template"**, GitHub will create a new repository in your account with the exact same directory structure and files.

## Quick Start After Generating a New Repository

1. **Clone your new repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-new-project.git
   cd your-new-project
   ```

2. **Run the initialization script** (recommended)

   On **Windows**:
   ```powershell
   .\scripts\init-from-template.ps1
   ```

   On **macOS / Linux**:
   ```bash
   chmod +x scripts/init-from-template.sh
   ./scripts/init-from-template.sh
   ```

   This script will:
   - Ask for your new project name
   - Update package names, titles, and branding
   - Clean up template-specific files

3. **Configure GitHub repository settings**

   See the **[GitHub Setup Guide](docs/github-setup.md)** for:
   - **Repository Rulesets** (recommended modern branch protection)
   - How to easily apply the included protection rules using our script
   - How to enable and customize the included CI workflows
   - Setting up CODEOWNERS
   - Enabling security features (Dependabot, CodeQL, Secret scanning)

   The template ships with a full modern GitHub DevOps stack:
   - Dependabot (dependency updates)
   - CodeQL (security scanning)
   - Merge Queue support
   - Automated Releases on version tags
   - Docker publishing to GHCR
   - Configurable Repository Rulesets for branch protection
   - PR auto-labeling

   **Strongly recommended after generating**:
   1. Run the initializer script
   2. Run the branch protection script:
      - Windows: `.\scripts\apply-branch-rulesets.ps1`
      - macOS/Linux: `./scripts/apply-branch-rulesets.sh`

3. **Install dependencies**
   ```powershell
   .\scripts\install.ps1
   ```

4. **Set up your environment**
   ```powershell
   .\scripts\setup.ps1
   ```

5. **Start developing**
   ```powershell
   .\scripts\start.ps1
   ```

## What Gets Copied

When you use this as a template, you get:

- Full Next.js 15 frontend (with Studio, Dashboard, Auth, etc.)
- Express + TypeScript backend
- Prisma + PostgreSQL setup
- BullMQ job queue (Redis)
- Advanced FFmpeg video rendering pipeline
- Real-time collaboration via Socket.IO
- Comprehensive documentation system
- PowerShell automation scripts (Windows-first)
- Production-ready Docker configuration
- Professional documentation (Architecture, Deployment, AI Integration, etc.)

## What You Should Customize

After generating a new repository, you will likely want to update:

| Item                        | Location                              | Notes |
|----------------------------|---------------------------------------|-------|
| Project Name               | `package.json`, README, docs         | Change "DesignXpress AI" to your project name |
| Branding / Logo            | `frontend/public/`                    | Replace the logo |
| API Keys                   | `.env` files                          | Add your own OpenAI, ElevenLabs, etc. keys |
| GitHub Repository URL      | README, docs                         | Update links |
| Organization / Author      | `package.json`, LICENSE (if added)   | Update as needed |

## Recommended Post-Template Steps

1. Delete or customize the following files:
   - `RELEASE_*.md` files (these are specific to this template's releases)
   - `CREATE_RELEASE_*.ps1` and `CREATE_RELEASE_*.txt`
   - `docs/RELEASE_COMMANDS.md` (unless you want to keep the release process)

2. Update the documentation hub:
   - Edit `docs/index.md` to reflect your project's documentation structure.

3. Mark your new repository as a template (optional):
   - Go to your repository → Settings → Check **"Template repository"** if you want others to use *your* version as a template later.

## Need Help?

- See the full [Documentation Hub](docs/index.md)
- Read the [Getting Started Guide](docs/getting-started.md)
- Check [Troubleshooting](docs/troubleshooting.md)

---

**Happy building!** We hope this template helps you launch your own AI-powered video platform faster.
