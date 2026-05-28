import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getFFmpegStatus } from '../services/ffmpegService';
import { queueExportJob, getExportStatus, getUserExports } from '../services/exportQueue';

const router = Router();

// POST /api/export/video  → now queues the job
router.post('/video', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId, scenes, musicUrl } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const exportJob = await queueExportJob({
      userId: req.user.id,
      projectId: projectId || 'demo',
      scenes: scenes || [],
      options: { musicUrl },
    });

    res.json({
      success: true,
      message: 'Export job queued successfully',
      jobId: exportJob.id,
      status: exportJob.status,
    });
  } catch (error: any) {
    console.error('Export queue error:', error);
    res.status(500).json({ error: 'Failed to queue export', details: error.message });
  }
});

// GET /api/export/jobs - user's export history
router.get('/jobs', authenticate, async (req: AuthRequest, res) => {
  try {
    const jobs = await getUserExports(req.user!.id);
    res.json({ jobs });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch export history' });
  }
});

// GET /api/export/status/:jobId
router.get('/status/:jobId', authenticate, async (req: AuthRequest, res) => {
  try {
    const job = await getExportStatus(req.params.jobId);

    if (!job || job.userId !== req.user!.id) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get job status' });
  }
});

// GET /api/export/ffmpeg-status
router.get('/ffmpeg-status', authenticate, (_req, res) => {
  res.json(getFFmpegStatus());
});

export default router;
