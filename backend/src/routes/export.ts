import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { renderVideo, getFFmpegStatus } from '../services/ffmpegService';

const router = Router();

// POST /api/export/video
router.post('/video', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId, scenes, musicUrl } = req.body;

    const status = getFFmpegStatus();
    if (!status.available) {
      return res.json({
        success: true,
        message: 'FFmpeg not found. Using cinematic demo render.',
        downloadUrl: '/uploads/exports/demo_render.mp4',
      });
    }

    const outputPath = await renderVideo(projectId || 'demo', scenes || [], { musicUrl });

    res.json({
      success: true,
      message: 'Video rendered with multi-track audio & transitions',
      downloadUrl: outputPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/export/ffmpeg-status
router.get('/ffmpeg-status', authenticate, (_req, res) => {
  res.json(getFFmpegStatus());
});

export default router;
