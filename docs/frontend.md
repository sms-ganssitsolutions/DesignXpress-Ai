# Frontend Documentation

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + custom glassmorphism / neon utilities
- **Animation**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios (with auth interceptor)
- **Real-time**: Socket.IO Client
- **Notifications**: Sonner (toast library)

## Folder Structure

```
frontend/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── media/
│   │   ├── billing/
│   │   └── settings/
│   ├── studio/              # Main video editor
│   ├── templates/           # Public marketplace
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles + design tokens
├── components/
│   ├── Logo.tsx
│   └── ui/                  # Reusable UI primitives
├── lib/
│   ├── api.ts               # Axios instance + typed API helpers
│   └── store.ts             # Zustand store (scenes, playback, collaboration)
└── public/
    └── designxpress-logo.png
```

## Global State (Zustand)

The main store is located in `lib/store.ts`.

Key pieces of state:
- `scenes`
- `selectedSceneId`
- `currentTime`, `isPlaying`, `totalDuration`
- `remoteCursors`, `activeCollaborators`
- `chatMessages`

Actions include:
- `addScene`, `updateScene`, `deleteScene`
- `setScenes`
- Playback controls (`seekTo`, `setIsPlaying`)
- Collaboration helpers

## API Layer

All API calls should go through `lib/api.ts`.

Example:

```ts
import { api } from '@/lib/api';

const res = await api.get('/projects');
```

Authentication token is automatically attached via Axios interceptor.

## Styling System

The project uses a custom design system defined in `globals.css`:

- `.glass` — Frosted glass effect
- `.neon-purple` / `.neon-orange` — Glow effects
- `.btn-primary` / `.btn-secondary`
- `.ai-suggestion` cards

Colors are defined in `tailwind.config.ts` under the `dx` namespace.

## Real-time Integration

Socket.IO connection is established in the Studio page.

Events currently used:
- `cursor-move` / `cursor-update`
- `scene-update` / `scene-updated`
- `chat-message`

## Important Pages

| Route                    | Purpose                              |
|--------------------------|--------------------------------------|
| `/`                      | Marketing landing page               |
| `/login`, `/register`    | Authentication                       |
| `/dashboard`             | Project list                         |
| `/studio`                | Main editor (`?project=xxx` or `?template=xxx`) |
| `/templates`             | Public templates marketplace         |
| `/media`                 | Asset library                        |
| `/billing`               | Subscription & PayPal flow           |

## Best Practices

- Keep the Studio page focused — move complex logic into custom hooks or the Zustand store when possible.
- Use `toast.success()` / `toast.error()` for user feedback.
- Always show loading states during async operations (especially AI calls and exports).
- Broadcast important state changes (like scene updates) to collaborators when the socket is connected.

---

This frontend is designed to feel premium while remaining maintainable.
