# Performance Guide

This document covers performance considerations, bottlenecks, and optimization strategies for DesignXpress AI Story Video Studio.

## Current Performance Characteristics (v1.0)

### Frontend
- **Strengths**: Lightweight (Zustand instead of heavy state managers), efficient Tailwind, Framer Motion only where needed
- **Potential Bottlenecks**:
  - Large timelines with 50+ scenes can cause re-render pressure if not memoized properly
  - Real-time cursor updates from many users can flood the DOM if not throttled
  - Video preview playback of high-resolution clips can be CPU-heavy in browser

### Backend
- **Strengths**: BullMQ offloads heavy work, Prisma is efficient for the current data model
- **Major Bottleneck**: FFmpeg rendering is CPU and I/O intensive. A single 4K export with multiple video clips + music can take minutes on a typical developer machine.

### Database
- PostgreSQL performs well for current load (projects, scenes, export jobs)
- No major indexing issues yet, but `ExportJob` and `AIRequest` tables will grow quickly with usage

### Rendering (FFmpeg)
- This is the single largest performance consumer in the system.
- Current implementation runs on the same machine as the web server in development.
- In production, rendering should be offloaded.

## Key Performance Areas

### 1. Video Rendering (Highest Impact)

**Current Approach**:
- Sequential per-scene segment creation + final concat with xfade
- CPU-bound on developer hardware

**Recommendations**:
- Use hardware acceleration where possible (`-hwaccel cuda` or QuickSync on Windows)
- Pre-scale assets during upload when possible (store multiple resolutions)
- Implement a dedicated rendering worker pool (separate from API servers)
- Consider cloud rendering services (AWS MediaConvert, Google Transcoder) for very large projects
- Cache rendered segments when only small parts of the timeline change

### 2. Real-time Collaboration

**Current State**:
- Cursor updates sent on every mousemove (can be chatty)
- Scene updates are broadcast on every change

**Optimizations Already Applied or Recommended**:
- Throttle cursor updates (e.g., every 50-100ms)
- Use `requestAnimationFrame` or debouncing on the client
- Only send diffs instead of full scene arrays when possible
- Consider WebRTC for very high-frequency updates in the future (cursors could move to P2P)

### 3. Asset Handling & Media Library

- Large video uploads can saturate bandwidth
- Recommendation: Implement client-side chunked uploads + progress
- Store original + optimized versions (e.g., 1080p proxy + 4K original)
- Use CDN for serving media in production

### 4. AI Calls

- OpenAI, ElevenLabs, and Stability calls have variable latency
- Current implementation has good fallback behavior
- Recommendations:
  - Add request timeouts and circuit breakers
  - Implement client-side optimistic UI for AI features
  - Cache common prompt results when appropriate (with user consent)

## Monitoring & Observability Recommendations

For production:

- **Backend**: Add structured logging (Pino or Winston) + correlation IDs
- **Rendering**: Track render duration per job, success rate, average queue wait time
- **Frontend**: Use Web Vitals + custom performance marks around heavy operations (timeline updates, export polling)
- **Database**: Monitor slow queries on `ExportJob` and `Scene` tables as data grows

## Scaling Strategies

### Horizontal Scaling
- Separate API servers from rendering workers
- Use BullMQ with multiple worker instances (can run on different machines)
- Stateless API layer (easy to scale behind load balancer)

### Vertical Scaling (Quick Wins)
- Give rendering workers more CPU cores and fast NVMe storage
- Increase Redis memory for larger BullMQ queues

### Cost Considerations
- FFmpeg rendering on cloud VMs can become expensive at scale
- Consider spot instances for rendering workers
- Implement fair queuing / priority for paid plans

## Performance Testing Ideas

- Measure time from "Export" click to file download for different project sizes
- Load test with 50+ concurrent users in one project (cursors + scene edits)
- Stress test the export queue with 20 simultaneous jobs

## Quick Wins Currently Available

1. Add `React.memo` + proper dependency arrays in heavy Studio components
2. Throttle cursor events more aggressively in the frontend
3. Add database indexes on `ExportJob(userId, createdAt)` and `Scene(projectId)`
4. Implement simple client-side video transcoding to 1080p on upload for faster preview

## Example Monitoring Metrics to Track

- Average render time per minute of final video
- Queue wait time vs actual render time
- Success rate of export jobs
- Peak concurrent users during collaboration sessions
- AI generation latency (p50 / p95)
- Database query times for timeline loads

## Recommended Tools

- **Backend**: Prometheus + Grafana, or Railway/AWS built-in metrics
- **Frontend**: Vercel Analytics / Google Lighthouse CI
- **Rendering**: Custom BullMQ job duration tracking + alerts on failures
- **Database**: Prisma query logging + slow query analysis

---

Performance in this platform is dominated by media processing. Most other areas (UI, real-time, API) are already reasonably efficient for the current feature set and can be improved incrementally.
