# Backend Documentation

## Technology Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache / Queue**: Redis + BullMQ
- **Real-time**: Socket.IO
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **File Uploads**: Multer

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Server entry + Socket.IO setup
│   ├── routes/                  # API route handlers
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── ai.ts
│   │   ├── export.ts            # Now uses BullMQ queue
│   │   ├── templates.ts
│   │   ├── upload.ts
│   │   └── subscription.ts
│   ├── services/
│   │   ├── aiService.ts         # OpenAI + ElevenLabs + Stability wrappers
│   │   ├── ffmpegService.ts     # Advanced video rendering engine
│   │   └── exportQueue.ts       # BullMQ queue + worker
│   └── middleware/
│       └── auth.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

## Running the Backend

Usually started via `.\scripts\start.ps1`.

You can also run it directly:

```bash
cd backend
npm run dev
```

## Key Services

### 1. AI Service (`aiService.ts`)

Handles:
- Script / Story / Scene generation via OpenAI
- Voiceover generation via ElevenLabs (when key present)
- Image generation via Stability AI (when key present)
- Graceful fallback to high-quality mock data

### 2. FFmpeg Service (`ffmpegService.ts`)

The heart of video rendering. Supports:
- Real video clips per scene
- Image-based scenes
- Multi-track audio (voiceover + music)
- Text overlays and subtitles
- Crossfades and transitions

### 3. Export Queue (`exportQueue.ts`)

Uses BullMQ to process video exports in the background:
- Creates `ExportJob` records
- Runs rendering in isolated worker
- Updates progress and final download URL
- Handles retries and failures

## Authentication

All protected routes use the `authenticate` middleware.

Token is expected in the `Authorization: Bearer <token>` header.

User information is attached to `req.user`.

## Database (Prisma)

### Important Models
- `User`
- `Project`
- `Scene`
- `Asset`
- `AIRequest`
- `ExportJob` (new in v1.0)
- `Template`

Run these commands when changing the schema:

```bash
npx prisma migrate dev --name your-change-name
npx prisma generate
```

## Real-time (Socket.IO)

The server maintains rooms per project (`project:{projectId}`).

Current events:
- `join-project`
- `cursor-move` / `cursor-update`
- `scene-update` / `scene-updated`
- `chat-message`

## Error Handling Philosophy

- All route handlers should wrap logic in try/catch
- Return meaningful error messages
- Never leak internal stack traces to clients in production
- Job failures in BullMQ are logged and stored in the `ExportJob` record

## Environment Variables

Key variables used by the backend:

```env
DATABASE_URL
REDIS_URL
JWT_SECRET
OPENAI_API_KEY
ELEVENLABS_API_KEY
STABILITY_API_KEY
UPLOAD_DIR
FFMPEG_PATH
```

---

The backend is designed to be reliable, observable, and easy to extend with new AI or rendering capabilities.
