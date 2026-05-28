# FFmpeg Rendering System

This document explains how video exports work in DesignXpress AI.

## Overview

All video rendering is handled by a custom FFmpeg pipeline located in:

`backend/src/services/ffmpegService.ts`

The system supports:

- Real uploaded video clips per scene
- Image-based scenes (thumbnails)
- Multi-track audio (voiceover + background music)
- Professional transitions and overlays
- Background job processing via BullMQ

## How Rendering Works (v1.0)

### 1. Job Queuing
When a user clicks "Export Video":
- A new `ExportJob` record is created in PostgreSQL
- A job is added to the BullMQ `video-exports` queue
- The frontend polls for status updates

### 2. Worker Processing
The BullMQ worker:
- Loads the job data (scenes + options)
- Calls `renderVideo(projectId, scenes, options)`
- Updates progress at multiple stages
- On success: saves output URL and marks job complete
- On failure: stores error message

### 3. Scene Segment Generation

For each scene, the renderer creates a high-quality MP4 segment:

**Case A: Scene has videoUrl**
- Uses the actual video file
- Trims to scene duration
- Applies overlays on top
- Can mix with separate voiceover (ducks original audio)

**Case B: Scene has thumbnailUrl (image)**
- Loops the image for the scene duration
- Applies professional scaling + letterboxing
- Adds cinematic color grading

**Case C: No media**
- Uses solid dark background

### 4. Overlays Applied

Every segment receives:
- Scene title (large, top-left with box)
- Burned-in script / subtitles (bottom area)
- Cinematic color correction (`eq=contrast=1.08:saturation=1.1`)

### 5. Audio Mixing

- Voiceover track (if present) is mixed with music bed
- Music is ducked when voiceover is active (sidechain compression)
- Final audio is normalized to AAC

### 6. Final Assembly

- All scene segments are concatenated
- Crossfades (dissolve / wipe / fade) are applied between scenes
- Final H.264 + AAC encode with faststart flag

## Supported Inputs per Scene

```ts
interface Scene {
  videoUrl?: string;        // Real video clip
  thumbnailUrl?: string;    // Image / key art
  voiceoverUrl?: string;    // ElevenLabs or custom audio
  title: string;
  script?: string;          // Burned as subtitles
  duration: number;
}
```

## Error Handling

The renderer includes robust error handling:
- Missing files → falls back to color background
- FFmpeg errors → job is marked failed with message
- Worker crashes → BullMQ retries the job (up to 2 attempts)

## Performance Notes

- Rendering is CPU and I/O intensive
- Designed to run in background workers
- In production, consider:
  - Dedicated rendering machines
  - GPU-accelerated FFmpeg builds
  - Cloud storage (S3) for input/output assets instead of local disk

## Future Enhancements

- Support for multiple audio tracks per scene
- Custom transition durations per scene
- LUT-based color grading
- Watermarking / branding overlays

---

This rendering engine is one of the most powerful parts of the platform and is designed to grow with professional use cases.
