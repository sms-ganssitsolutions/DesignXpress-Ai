# Getting Started Guide

This guide will walk you through setting up **DesignXpress AI Story Video Studio** on Windows 11.

## Prerequisites

- **Windows 11**
- **Node.js 20+** ([Download here](https://nodejs.org/))
- **Docker Desktop** ([Download here](https://www.docker.com/products/docker-desktop/))
- **PowerShell** (included with Windows)
- Git (optional but recommended)

## Step 1: Enable PowerShell Script Execution

Windows blocks script execution by default. Run this command **once** in an **Administrator** PowerShell window:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 2: Clone or Download the Project

If using Git:

```powershell
git clone <your-repo-url>
cd "DesignXpress Ai"
```

## Step 3: Run the Installation Script

```powershell
.\scripts\install.ps1
```

This script will:
- Check for Node.js and npm
- Install all frontend and backend dependencies
- Create `.env` and `frontend/.env.local` files from examples
- Create necessary upload directories

## Step 4: Initialize the Database and Services

```powershell
.\scripts\setup.ps1
```

This script will:
- Start PostgreSQL and Redis via Docker Compose
- Run Prisma migrations
- Seed the database with demo data
- Verify FFmpeg availability (warning if not found)

**Note:** Docker Desktop must be running before executing this script.

## Step 5: Start the Application

```powershell
.\scripts\start.ps1
```

This will:
- Start all Docker services (Postgres, Redis, PgAdmin)
- Launch the backend API on port 5000
- Launch the Next.js frontend on port 3000
- Automatically open http://localhost:3000 in your browser

## Access Points

| Service       | URL                              | Notes                              |
|---------------|----------------------------------|------------------------------------|
| Frontend      | http://localhost:3000            | Main application                   |
| Backend API   | http://localhost:5000            | REST API                           |
| PgAdmin       | http://localhost:8080            | Database admin (user: admin@designxpress.ai / designxpress2026) |
| PostgreSQL    | localhost:5432                   | Database                           |
| Redis         | localhost:6379                   | Job queue & real-time              |

## Demo Account

```
Email:    demo@designxpress.ai
Password: demo123456
```

## Enabling Full AI Features

For real AI generation, add your API keys to the root `.env` file:

```env
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
STABILITY_API_KEY=your-key-here
```

Then restart the application.

## Common First-Run Issues

### Docker not running
→ Make sure Docker Desktop is running and healthy before running `setup.ps1`.

### FFmpeg not found
→ The system will still work using demo renders. For real video export, download FFmpeg and place `ffmpeg.exe` in `C:\ffmpeg\bin\` (or update `FFMPEG_PATH` in `.env`).

### Port already in use
→ Stop any other services using ports 3000, 5000, or 5432.

## Next Steps

- Read the [Development Guide](./development.md)
- Explore the [Architecture Overview](./architecture.md)
- Start creating projects in the Studio!

---

**You are now ready to build cinematic AI stories.**
