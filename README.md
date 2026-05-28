# DESIGNXPRESS AI STORY VIDEO STUDIO

**Where Innovation Meets Excellence**

A premium cinematic AI video storytelling platform. Built for Windows 11 with full PowerShell automation, Docker, and production-ready architecture.

---

## ✨ What's Included (v0.4 - Advanced Local Build)

- **Cinematic Landing Page** — Futuristic glassmorphism + neon purple/orange design
- **Full Authentication** — Login, Register, JWT-based (demo ready)
- **Dashboard** — Project management
- **Professional AI Video Studio** — Timeline, preview player, AI tools panel
- **Real AI Integration** — OpenAI (GPT-4o-mini) for scripts/stories/scenes + graceful fallback
- **FFmpeg Export Pipeline** — Real video rendering support (with demo fallback)
- **Templates Gallery**
- **Media Library**
- **Advanced Drag & Drop Timeline** with real timecodes + scene editing modal
- **Real AI Providers** — OpenAI + ElevenLabs (voice) + Stability AI (images) fully wired
- **Ultra Advanced FFmpeg** — Crossfades, proper image scaling, burned subtitles, voiceover mixing
- **In-Studio Asset Upload** — Attach images & voiceovers directly to scenes
- **Professional Render Progress** — Live logs + beautiful progress modal
- **Production Docker** — Full prod compose + nginx + deployment script
- **Subscriptions Stub** — Billing page + plan management UI + backend routes
- **Windows-first automation** (install.ps1, setup.ps1, start.ps1, deploy.ps1)

---

## 🚀 Windows 11 Quick Start

### 1. One-time PowerShell fix (Administrator)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install

```powershell
.\scripts\install.ps1
```

### 3. Setup Database + Prisma

```powershell
.\scripts\setup.ps1
```

### 4. Launch Everything

```powershell
.\scripts\start.ps1
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend:  http://localhost:5000
- PgAdmin:  http://localhost:8080

**Demo Account:**
```
demo@designxpress.ai
demo123456
```

---

## 🧠 AI Features

| Feature             | Status                  |
|---------------------|-------------------------|
| Script / Story Gen  | ✅ Real OpenAI + Mock   |
| Voiceover           | ✅ UI + Mock backend    |
| AI Thumbnails       | ✅ UI + Mock backend    |
| Auto Subtitles      | ✅ UI + Mock backend    |
| Video Export        | ✅ FFmpeg foundation    |

**To enable real AI:**
Add your keys to `.env`:
```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
STABILITY_API_KEY=...
```

---

## 📁 Key Commands

```powershell
.\scripts\start.ps1           # Start everything
.\scripts\setup.ps1           # Re-run migrations + seed
docker compose down           # Stop containers
npm run db:studio             # Open Prisma Studio
```

---

## 🛠 Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind, Framer Motion, Zustand, Axios  
**Backend:** Express, TypeScript, Prisma, PostgreSQL, Redis, JWT  
**AI:** OpenAI, ElevenLabs, Stability AI (ready)  
**Infra:** Docker, FFmpeg, PowerShell automation

---

## 📸 Logo

Official logo is located at `frontend/public/designxpress-logo.png` and used throughout the platform.

---

## 🔮 Next Steps (Roadmap)

- Drag & drop timeline + real video preview
- Full ElevenLabs + Stability AI integration
- User subscriptions & Stripe
- Real-time collaboration via Socket.IO
- Advanced FFmpeg scene stitching

---

**Built with precision for creators who demand excellence.**

DesignXpress AI — Where Innovation Meets Excellence.
