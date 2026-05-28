# DesignXpress AI - Diagrams and Visual Documentation

This document centralizes all visual diagrams for the DesignXpress AI Story Video Studio platform. Diagrams are written in Mermaid syntax for easy rendering in GitHub, VS Code, and documentation tools.

## 1. High-Level System Architecture

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

## 2. AI Services Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Studio as Studio UI
    participant API as Backend API
    participant AISvc as AI Service
    participant OpenAI as OpenAI API
    participant DB as PostgreSQL

    User->>Studio: Click "Generate Script"
    Studio->>API: POST /ai/generate {type: "script", prompt, projectId}
    API->>AISvc: generateWithAI({type, prompt})
    AISvc->>OpenAI: chat.completions.create (GPT-4o-mini)
    OpenAI-->>AISvc: Response (script/scenes)
    AISvc->>DB: Save AIRequest (status: completed, result)
    AISvc-->>API: {result, requestId}
    API-->>Studio: Return result
    Studio->>Studio: Apply to timeline / show suggestions
    Studio->>User: Display generated content
```

**Notes on AI Flow:**
- If OpenAI key is missing or rate-limited → graceful fallback to high-quality mock data in `aiService.ts`
- All AI calls are logged in the `AIRequest` table with status, tokens, and cost
- Error handling: Network failures, invalid prompts, and quota errors are caught and returned with clear messages

## 3. Media Upload Pipeline

```mermaid
flowchart LR
    User[User in Studio] --> Upload[Upload Component]
    Upload --> API[POST /upload]
    API --> Multer[File Parser]
    Multer --> Storage[Save to uploads/ folder]
    Storage --> DB[Create Asset record in DB]
    DB --> Response[Return {url, filename, type}]
    Response --> Studio[Update Zustand Store]
    Studio --> Scene[Attach to Selected Scene]
    Scene --> Timeline[Update Timeline UI]
    Scene --> Preview[Enable Video/Image Preview]
```

**Key Details:**
- Supports image, video, and audio files
- Files are stored locally in `uploads/` (production should use S3/Spaces)
- After upload, user can immediately attach the asset to any scene
- Video assets become playable in the Studio preview
- Video assets are passed to FFmpeg for real clip rendering

## 4. Export Queue + BullMQ Flow (Detailed)

```mermaid
sequenceDiagram
    participant User
    participant Studio as Studio UI
    participant API as Backend API
    participant Queue as BullMQ Queue
    participant Worker as Export Worker
    participant FFmpeg as FFmpeg Service
    participant DB as PostgreSQL

    User->>Studio: Click Export with Music
    Studio->>API: POST /export/video {scenes, musicUrl}
    API->>DB: Create ExportJob (status: queued)
    API->>Queue: Add job with exportJobId + data
    API-->>Studio: {jobId, status: "queued"}
    Studio->>Studio: Start polling every 2s

    Queue->>Worker: Process job
    Worker->>DB: Update ExportJob → processing, progress: 10
    Worker->>FFmpeg: renderVideo(projectId, scenes, {musicUrl})
    FFmpeg->>FFmpeg: Generate per-scene segments (video/image + overlays)
    FFmpeg->>FFmpeg: Apply transitions + multi-track audio
    FFmpeg-->>Worker: Return outputPath
    Worker->>DB: Update ExportJob (completed, outputUrl, progress: 100)
    Worker-->>Queue: Job done

    Studio->>API: GET /export/status/:jobId (multiple times)
    API->>DB: Fetch latest status
    API-->>Studio: {status, progress, outputUrl?}
    Studio->>User: Live progress bar + logs
    alt Completed
        Studio->>Studio: Trigger auto-download
    end
```

**Error Handling in Queue:**
- Job failures are caught and stored in `ExportJob.error`
- Up to 2 automatic retries with exponential backoff
- User sees clear failure state in the progress modal

## 5. Real-time Collaboration Flow

```mermaid
flowchart LR
    A[User A Studio] -- cursor-move / scene-update / chat-message --> Socket[Socket.IO Server]
    B[User B Studio] -- same --> Socket
    C[User C Studio] -- same --> Socket

    Socket -- broadcast to room --> A
    Socket -- broadcast to room --> B
    Socket -- broadcast to room --> C

    subgraph Room
        direction TB
        RoomName["project:{projectId}"]
        Presence[Active Users List]
        Cursors[Live Cursor Positions]
        SceneSync[Scene State Sync]
        Chat[Team Chat Messages]
    end
```

## 6. Project + Scene Data Model (ER Diagram)

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
    Asset }o--|| Project : belongs_to

    ExportJob }o--|| Project : for
    ExportJob }o--|| User : by

    AIRequest }o--|| User : by
    AIRequest }o--o| Project : optional_for

    Subscription }o--|| User : for
```

---

These diagrams are maintained in `docs/diagrams.md` and embedded in `docs/architecture.md` for easy reference.

For the best experience, view this file in a Markdown renderer that supports Mermaid (GitHub, VS Code with Mermaid extension, etc.).
