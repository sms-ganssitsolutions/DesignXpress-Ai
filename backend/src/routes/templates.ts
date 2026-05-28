import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET public templates (for marketplace)
router.get('/public', async (_req, res) => {
  const templates = await prisma.template.findMany({
    where: { isPublic: true },
    orderBy: { usageCount: 'desc' },
    take: 20,
  });
  res.json({ templates });
});

// POST publish current project as template
router.post('/publish', authenticate, async (req: AuthRequest, res) => {
  const { projectId, title, description, category } = req.body;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.user!.id },
    include: { scenes: true },
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const template = await prisma.template.create({
    data: {
      title: title || project.title,
      description: description || project.description,
      category: category || 'Cinematic',
      thumbnail: project.thumbnail,
      prompt: 'Published from project',
      scenes: project.scenes as any,
      isPublic: true,
      usageCount: 0,
    },
  });

  res.json({ success: true, template });
});

// GET single template (for loading into studio)
router.get('/:id', async (req, res) => {
  const template = await prisma.template.findUnique({
    where: { id: req.params.id },
  });

  if (!template) return res.status(404).json({ error: 'Template not found' });

  res.json({ template });
});
