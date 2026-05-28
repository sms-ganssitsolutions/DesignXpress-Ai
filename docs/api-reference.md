# API Reference

This document covers the most important backend endpoints.

**Base URL (development)**: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication

### POST /auth/register
Create a new user.

### POST /auth/login
Login and receive JWT.

**Response**:
```json
{
  "user": { "id": "...", "email": "...", "name": "..." },
  "token": "jwt-token-here"
}
```

### GET /auth/me
Get current authenticated user.

---

## Projects

### GET /projects
List all projects belonging to the current user.

### GET /projects/:id
Get a single project with scenes and assets.

### POST /projects
Create a new project.

### PUT /projects/:id/scenes
Replace all scenes (used by Studio). Also creates a version snapshot.

### GET /projects/:id/versions
Get version history for a project.

### POST /projects/:id/restore/:versionId
Restore a previous version of the project.

### POST /projects/:id/share
Generate a public share link for the project.

---

## Exports (BullMQ Powered)

### POST /export/video
Queue a new video export job.

**Body**:
```json
{
  "projectId": "xxx",
  "scenes": [...],
  "musicUrl": "/uploads/temp/some-music.mp3"   // optional
}
```

**Response**:
```json
{
  "jobId": "export-job-id",
  "status": "queued"
}
```

### GET /export/jobs
Get export history for the current user (last 20).

### GET /export/status/:jobId
Get real-time status of an export job (includes `progress` and `outputUrl` when complete).

### GET /export/ffmpeg-status
Check if FFmpeg is available on the server.

---

## AI Generation

### POST /ai/generate

**Body**:
```json
{
  "type": "script" | "story" | "scene" | "voiceover" | "thumbnail" | "subtitle" | "music",
  "prompt": "Your creative prompt here",
  "projectId": "optional-project-id"
}
```

Returns AI result (real OpenAI when key is configured, otherwise high-quality demo).

---

## Templates

### GET /templates/public
Get publicly published templates.

### POST /templates/publish
Publish a project as a reusable template.

### GET /templates/:id
Load a specific template (used when opening from marketplace).

---

## Uploads

### POST /upload
Upload a file (image, video, or audio).

Returns file information including public URL.

---

## Error Responses

Most errors follow this shape:

```json
{
  "error": "Human readable message",
  "details": "Optional technical details"
}
```

Common status codes:
- `400` — Bad request / validation error
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden
- `404` — Not found
- `500` — Internal server error

---

This reference will be expanded as more endpoints are added.
