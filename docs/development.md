# Development Guide

This guide covers how to work on the DesignXpress AI codebase locally.

## Starting the Environment

Always use the provided PowerShell scripts:

```powershell
.\scripts\start.ps1
```

This starts:
- Docker services (Postgres, Redis, PgAdmin)
- Backend (Express + TypeScript with ts-node-dev)
- Frontend (Next.js with hot reload)

## Useful Commands

| Command                        | Description                              |
|--------------------------------|------------------------------------------|
| `.\scripts\install.ps1`        | Install all npm dependencies             |
| `.\scripts\setup.ps1`          | Run migrations + seed database           |
| `.\scripts\start.ps1`          | Start full development stack             |
| `docker compose down`          | Stop all containers                      |
| `npm run db:studio` (in root)  | Open Prisma Studio                       |
| `cd backend && npx prisma migrate dev` | Create new migration          |

## Working on the Frontend

Location: `frontend/`

- Run `npm run dev` (usually handled by `start.ps1`)
- Hot reloading is enabled
- State lives primarily in `lib/store.ts` (Zustand)
- API calls go through `lib/api.ts`

### Key Frontend Areas
- `app/studio/page.tsx` — The main video editor
- `app/(dashboard)/...` — Dashboard, media, billing, etc.
- `components/` — Reusable UI (Logo, etc.)

## Working on the Backend

Location: `backend/`

- Uses `ts-node-dev` for hot reloading
- Main entry: `src/index.ts`
- Routes: `src/routes/`
- Services: `src/services/` (FFmpeg, AI, Export Queue)

### Important Backend Services
- `services/ffmpegService.ts` — Video rendering logic
- `services/exportQueue.ts` — BullMQ job queue
- `services/aiService.ts` — OpenAI + fallback logic

## Database Changes

When modifying `backend/prisma/schema.prisma`:

```powershell
cd backend
npx prisma migrate dev --name your-migration-name
npx prisma generate
```

Then restart the backend.

## Debugging

### Backend
- Logs appear in the backend terminal window
- Use `console.log` liberally during development
- Prisma queries can be logged by setting `log: ['query']` in the Prisma client

### Frontend
- Browser DevTools + React DevTools
- Zustand state can be inspected using the Zustand devtools middleware (add temporarily if needed)

### Docker Services
```powershell
docker compose logs -f postgres
docker compose logs -f redis
```

## Environment Files

- Root `.env` — Shared backend + infrastructure config
- `frontend/.env.local` — Frontend-specific variables (API URL, etc.)
- `backend/.env` — Backend-specific overrides (usually symlinked or copied from root)

Never commit real API keys.

## Adding New Features

Recommended flow:

1. Update Prisma schema if needed → run migration
2. Add backend route + service logic (with error handling)
3. Add frontend API call in `lib/api.ts`
4. Update Zustand store if global state is required
5. Add UI components
6. Test with real data + error cases
7. Update relevant documentation in `docs/`

## Code Style Guidelines

- TypeScript strict mode is enabled — avoid `any` when possible
- Prefer functional components + hooks in React
- Use `toast` from Sonner for user feedback
- Always handle loading and error states in async operations
- Keep components focused and reasonably small

---

Happy building!
