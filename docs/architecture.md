# Architecture Overview

This document describes the high-level system design of **DesignXpress AI Story Video Studio**.

## System Overview

DesignXpress is a full-stack application consisting of:

- **Frontend**: Modern single-page application built with Next.js
- **Backend**: REST API + WebSocket server
- **Data Layer**: PostgreSQL + Redis
- **Media Processing**: FFmpeg (via background jobs)
- **AI Services**: OpenAI, ElevenLabs, Stability AI
- **Job Queue**: BullMQ + Redis

## High-Level Architecture

### System Overview Diagram

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        FE[Next.js 15 + React]
        State[Zustand State]
        Socket[Socket.IO Client]
    end

    subgraph Gateway["Gateway (Production)"]
        Nginx[NGINX Reverse Proxy]
    end

    subgraph Backend["Backend (Express + TypeScript)"]
        API[REST API Routes]
        Realtime[Socket.IO Server]
        Services[Business Services]
    end

    subgraph Data["Data & Processing Layer"]
        Postgres[(PostgreSQL + Prisma)]
        Redis[(Redis + BullMQ)]
        FFmpeg[FFmpeg Worker]
    end

    subgraph External["External Services"]
        OpenAI[OpenAI]
        ElevenLabs[ElevenLabs]
        Stability[Stability AI]
    end

    FE --> Nginx
    Nginx --> API
    Nginx --> Realtime

    API --> Services
    Realtime --> Services

    Services --> Postgres
    Services --> Redis
    Services --> FFmpeg

    FFmpeg --> External
    Services --> External
```

### Video Export Flow (BullMQ)

```mermaid
sequenceDiagram
    participant User
    participant Studio as Studio UI
    participant API as Backend API
    participant Queue as BullMQ Queue
    participant Worker as Export Worker
    participant FFmpeg as FFmpeg Renderer
    participant DB as PostgreSQL

    User->>Studio: Click "Export Video"
    Studio->>API: POST /export/video
    API->>DB: Create ExportJob (queued)
    API->>Queue: Add job to queue
    API-->>Studio: Return jobId
    Studio->>Studio: Start polling status

    Queue->>Worker: Process job
    Worker->>DB: Update status → processing
    Worker->>FFmpeg: Run renderVideo()
    FFmpeg->>External: Call AI services if needed
    FFmpeg-->>Worker: Return output path
    Worker->>DB: Update job (completed + URL)
    Worker-->>Queue: Job complete

    Studio->>API: GET /export/status/:jobId
    API->>DB: Fetch job status
    API-->>Studio: Return progress + download URL
    Studio->>User: Show progress + auto-download
```

### Export Job State Machine

```mermaid
stateDiagram-v2
    [*] --> Queued : User submits export
    Queued --> Processing : Worker picks up job
    Processing --> Completed : Render successful
    Processing --> Failed : Error during rendering
    Failed --> Queued : Manual retry (optional)
    Completed --> [*]
    Failed --> [*]
```
### Real-time Collaboration Flow

```mermaid
flowchart LR
    A[User A - Studio] -->|cursor-move / scene-update / chat| Socket[Socket.IO Server]
    B[User B - Studio] -->|same events| Socket
    C[User C - Studio] -->|same events| Socket

    Socket -->|broadcast to room| A
    Socket -->|broadcast to room| B
    Socket -->|broadcast to room| C

    subgraph "Project Room"
        Room["project:{projectId}"]
    end
```

## Data Model (Key Entities)

- **User** – Authentication and ownership
- **Project** – Main container for a video story
- **Scene** – Individual timeline segment (can contain video, image, audio, text)
- **Asset** – Uploaded media files
- **AIRequest** – History of AI generations
- **ExportJob** – Background video render jobs (BullMQ + DB)
- **Template** – Reusable published projects

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Project : owns
    User ||--o{ AIRequest : creates
    User ||--o{ ExportJob : submits
    User ||--o{ Subscription : has

    Project ||--o{ Scene : contains
    Project ||--o{ Asset : has
    Project ||--o{ ExportJob : has
    Project ||--o{ AIRequest : triggers

    Scene }o--|| Project : belongs_to

    ExportJob }o--|| Project : for
    ExportJob }o--|| User : by

    AIRequest }o--|| User : by
    AIRequest }o--o| Project : optional_for

    Subscription }o--|| User : for
```

## Key Flows

### 1. Creating & Editing a Project
1. User creates project via Dashboard
2. Opens project in Studio
3. Adds/edits scenes (local Zustand state)
4. Changes are saved to PostgreSQL
5. If collaborators are present → changes broadcast via Socket.IO

### 2. Video Export Flow (v1.0)
1. User clicks "Export Video" in Studio
2. Frontend calls `POST /api/export/video`
3. Backend creates `ExportJob` record and adds job to BullMQ queue
4. Worker picks up job and runs `renderVideo()` (advanced FFmpeg pipeline)
5. Progress is updated in real time (polled by frontend)
6. On completion → output file is made available for download

### 3. Real-time Collaboration
- All users in the same project join a Socket.IO room (`project:{id}`)
- Cursor movements are broadcast to other users
- Scene changes are emitted and applied optimistically on other clients
- Simple chat messages are relayed in real time

## Technology Decisions

- **Next.js App Router** — Modern React patterns and server components
- **Zustand** — Lightweight global state (preferred over Redux for this scale)
- **Prisma** — Type-safe database access
- **BullMQ** — Reliable background jobs with retries and progress
- **Socket.IO** — Battle-tested real-time communication
- **FFmpeg** — Industry standard for video processing (scriptable and powerful)
- **Docker** — Consistent environment across development and production

## Security & Isolation

- JWT-based authentication on all protected routes
- User-scoped queries (projects, exports, etc.)
- File uploads stored in user/project-specific folders
- Environment variables for all secrets

---

This architecture balances rapid local development (Windows-first) with a clear path to scalable production deployment.
