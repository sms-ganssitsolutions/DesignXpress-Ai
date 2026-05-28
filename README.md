# DESIGNXPRESS AI STORY VIDEO STUDIO

**Where Innovation Meets Excellence**

A premium, cinematic AI-powered video storytelling platform. Built as a full-stack local development environment optimized for **Windows 11**, with professional-grade tools, real-time collaboration, advanced rendering, and production-ready architecture.

---

## ✨ Current Feature Set (v1.0)

### Core Platform
- **Cinematic Landing Page** — Futuristic glassmorphism design with neon purple + orange accents
- **Full Authentication System** — Login, Register, JWT (demo account ready)
- **Dashboard** — Project management with real database persistence
- **Professional AI Video Studio** — Advanced timeline editor, preview player, layered AI tools

### Editing & Rendering
- **Advanced Drag & Drop Timeline** with real timecodes and scene editing modal
- **Playable Video Preview** — Play actual uploaded video clips directly in the timeline
- **Ultra Advanced FFmpeg Renderer (v1.0)**:
  - Real uploaded video clip support per scene
  - Multi-track audio (voiceover + music bed with intelligent ducking)
  - Advanced transitions (dissolve, wipe, fade)
  - Burned-in titles and subtitles
  - Proper scaling and cinematic color grading

### AI Capabilities
- **AI Script & Story Generator** — Powered by OpenAI (real calls when keys present)
- **AI Voiceovers** — ElevenLabs integration ready
- **AI Thumbnails & Key Art** — Stability AI + DALL·E ready
- **AI Music Suggestions** — Cinematic background music prompt generator
- **Auto Subtitles** — Timed caption generation

### Collaboration & Sharing
- **Real-time Collaboration**:
  - Live floating cursors with user names and colors
  - Bidirectional scene synchronization
  - In-Studio team chat
  - Active collaborator presence avatars
- **Templates Marketplace** — Publish projects as templates and load them with one click
- **Project Version History** — Automatic versioning with one-click restore
- **Public Project Sharing** — Generate shareable links (foundation complete)

### Backend & Infrastructure
- **BullMQ Export Queue** — Professional background job system for video rendering
- **Export History & Status Tracking** — Full job lifecycle with error handling
- **Media Library** — Organized asset management with folders and search
- **PayPal Integration** — Working checkout experience (sandbox)

### Developer Experience
- **Windows-First Automation** — `install.ps1`, `setup.ps1`, `start.ps1`, `deploy.ps1`
- **Full Docker Support** — Development and production compose files
- **Production Deployment Guide** — Detailed instructions for Railway, AWS, and VPS

---

## 🚀 Quick Start (Windows 11)

### 1. Enable PowerShell Scripts (One-time, run as Administrator)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies

```powershell
.\scripts\install.ps1
```

### 3. Initialize Database & Prisma

```powershell
.\scripts\setup.ps1
```

### 4. Start the Full Application

```powershell
.\scripts\start.ps1
```

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PgAdmin**: http://localhost:8080

**Demo Account:**
```
Email:    demo@designxpress.ai
Password: demo123456
```

---

## 📁 Project Structure

```
DesignXpress Ai/
├── frontend/                 # Next.js 15 + TypeScript + Tailwind
│   ├── app/                  # App Router (pages, layouts)
│   ├── components/           # Reusable UI components
│   └── lib/                  # API client, Zustand store
├── backend/                  # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # FFmpeg, AI, BullMQ queues
│   │   └── middleware/       # Auth, etc.
│   └── prisma/               # Schema + migrations + seed
├── scripts/                  # PowerShell automation
│   ├── install.ps1
│   ├── setup.ps1
│   ├── start.ps1
│   └── deploy.ps1
├── docker/                   # Production Docker configs
├── docs/                     # Comprehensive documentation
├── uploads/                  # User media (videos, images, audio)
└── docker-compose.yml        # Development infrastructure
```

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15 (App Router)
- TypeScript, Tailwind CSS, Framer Motion
- Zustand (global state)
- Socket.IO Client (real-time)

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Redis + BullMQ (job queue)
- Socket.IO (real-time collaboration)
- JWT Authentication

**AI & Media**
- OpenAI (script, story, scene generation)
- ElevenLabs (voiceovers)
- Stability AI (images)
- FFmpeg (advanced video rendering)

**Infrastructure**
- Docker + Docker Compose
- PowerShell automation for Windows
- Production-ready deployment configs

---

## 📚 Documentation

All documentation is organized in the [Documentation Hub](./docs/index.md).

### Quick Links
- [Getting Started](./docs/getting-started.md)
- [Architecture Overview](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)
- [API Reference](./docs/api-reference.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Contributing](./docs/contributing.md)
- [Security](./docs/security.md)
- [Roadmap](./docs/roadmap.md)

**For a single-file version** (ideal for printing or PDF export), see:
- [Complete User & Developer Guide](./docs/DesignXpress_AI_Complete_User_and_Developer_Guide.md)

### Releases
- Latest: **[v1.0-documentation-complete](./RELEASE_NOTES.md)** (Comprehensive Documentation Overhaul)
- See full release history: [docs/releases.md](./docs/releases.md)

### Additional Specialized Documentation
- [Diagrams](./docs/diagrams.md) — Architecture & flow visualizations
- [Workflows](./docs/workflows.md) — Common user & developer flows
- [FAQ](./docs/faq.md)
- [Testing](./docs/testing.md)
- [Performance](./docs/performance.md)

---

## ☁️ Deployment

See the detailed [Deployment Guide](./docs/deployment.md) for:

- Railway (recommended for quick production)
- AWS ECS / App Runner
- Any VPS using Docker Compose

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your keys for full AI functionality:

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
STABILITY_API_KEY=...
```

---

## 🧪 Key Commands

```powershell
.\scripts\start.ps1              # Start full stack
.\scripts\setup.ps1              # Re-initialize database
docker compose down              # Stop all containers
npm run db:studio                # Open Prisma Studio (database browser)
```

---

## 📸 Branding

The official DesignXpress logo is located at:
`frontend/public/designxpress-logo.png`

It is used across the landing page, auth screens, Studio, and favicon.

---

## 🔮 Roadmap / Future Work

- Full real-time video preview scrubbing
- Export queue dashboard with progress
- Advanced usage analytics & billing
- Team workspaces & permissions
- Public project viewer page

---

**Built with precision for creators who demand excellence.**

DesignXpress AI — Where Innovation Meets Excellence.
