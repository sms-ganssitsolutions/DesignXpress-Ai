import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const createProjectSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
});

// GET /api/projects - List user's projects
router.get('/', authenticate, async (req: AuthRequest, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user!.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { scenes: true, assets: true } },
    },
  });
  res.json({ projects });
});

// GET /api/projects/:id
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: {
      scenes: { orderBy: { order: 'asc' } },
      assets: true,
    },
  });

  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

// POST /api/projects
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, description } = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ project });
  } catch (e) {
    res.status(400).json({ error: 'Invalid project data' });
  }
});

// PATCH /api/projects/:id
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  const project = await prisma.project.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: req.body,
  });

  if (project.count === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

// DELETE /api/projects/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  const deleted = await prisma.project.deleteMany({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (deleted.count === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

// PUT /api/projects/:id/scenes - Replace all scenes for a project (used by Studio)
const sceneSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string(),
  duration: z.number().min(1),
  script: z.string().optional(),
  voiceoverUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  startTime: z.number().optional(),
});

router.put('/:id/scenes', authenticate, async (req: AuthRequest, res) => {
  try {
    const { scenes } = req.body;

    if (!Array.isArray(scenes)) {
      return res.status(400).json({ error: 'scenes must be an array' });
    }

    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete existing scenes
    await prisma.scene.deleteMany({
      where: { projectId: req.params.id },
    });

    // Create new scenes with proper ordering
    const createdScenes = await Promise.all(
      scenes.map((scene: any, index: number) =>
        prisma.scene.create({
          data: {
            projectId: req.params.id,
            order: index + 1,
            title: scene.title,
            duration: scene.duration,
            script: scene.script || null,
            voiceoverUrl: scene.voiceoverUrl || null,
            thumbnailUrl: scene.thumbnailUrl || null,
            startTime: scene.startTime || index * scene.duration,
          },
        })
      )
    );

    res.json({ success: true, scenes: createdScenes });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to save scenes' });
  }
});

export default router;
