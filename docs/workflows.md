# Common Workflows

This document describes the most common user and developer workflows in DesignXpress AI Story Video Studio.

## User Workflows (Creators)

### 1. Creating Your First AI Video Project

1. Log in with demo account or register
2. On Dashboard, click **"New AI Project"**
3. Give it a title (e.g., "Neon Requiem")
4. Open the project in the Studio
5. Add scenes using the **+ Add Scene** button
6. For each scene:
   - Edit title, duration, and script via double-click
   - Upload media (video/image/audio) via the **Media** tab
   - Generate AI content (Script, Voiceover, Thumbnail, Music prompt) using the AI panel
7. Preview video clips directly in the timeline preview
8. Use **Export Video** (with optional music bed) to render the final video via BullMQ queue
9. Monitor progress in the live export modal
10. Download the finished video when complete

### 2. Collaborating in Real Time

1. Open the same project in two different browser windows/tabs (or with different users)
2. You will see:
   - Colored floating cursors of other users in the preview
   - Active collaborator avatars in the top bar
3. Make changes to scenes → other users see updates instantly
4. Use the **Chat** tab in the right panel for quick communication
5. All changes are saved automatically to the database

### 3. Using Templates from the Marketplace

1. Go to the **Templates** page from the landing page or dashboard
2. Browse community or published templates
3. Click **"Use Template"** on any template
4. The Studio opens with the full scene structure pre-loaded
5. Customize the project as needed
6. (Optional) Make your own improvements and **Publish as Template** to share back with the community

### 4. Managing Assets

1. Go to **Media Library** from the dashboard
2. Upload images, video clips, and audio files
3. Use folders and search to organize content
4. In the Studio, use the **Media** tab to attach assets directly to the current scene
5. Attached video clips become immediately playable in the preview

## Developer Workflows

### 1. Adding a New AI Feature

1. Add a new button in the AI panel (`app/studio/page.tsx`)
2. Extend the `handleGenerateAI` function (or create a new handler)
3. Update `backend/src/services/aiService.ts` with the new generation logic (use OpenAI when key exists, else strong mock)
4. Add a new type to the AI route if needed
5. Store the request in the `AIRequest` table for history
6. Test with and without API keys
7. Update `docs/ai-integration.md`

### 2. Improving the FFmpeg Renderer

1. Modify logic in `backend/src/services/ffmpegService.ts`
2. Test changes using the Export flow in Studio
3. Use the BullMQ queue (it will automatically pick up the new code)
4. Add proper error handling and progress updates
5. Document changes in `docs/ffmpeg-rendering.md`

### 3. Adding Real-time Features

1. Add new Socket.IO events in `backend/src/index.ts`
2. Emit events from the Studio when relevant actions occur
3. Listen for events on the client and update Zustand store
4. Test with multiple browser instances
5. Update `docs/collaboration.md`

### 4. Working on the Export Queue

1. Modify job logic in `backend/src/services/exportQueue.ts`
2. Update the export route (`backend/src/routes/export.ts`) if API surface changes
3. Update the progress polling UI in `app/studio/page.tsx`
4. Test failure scenarios (missing files, FFmpeg errors)
5. Add entries to export history as needed

## Administrative / Maintenance Workflows

- Run `.\scripts\setup.ps1` after schema changes
- Use `npx prisma studio` to inspect data
- Monitor BullMQ jobs via Redis (or add a simple admin UI later)
- Check logs in the backend terminal window during development

---

These workflows represent the core value loops of the platform. When adding new features, consider how they fit into (or extend) these flows.
