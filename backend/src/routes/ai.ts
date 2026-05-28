import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { generateWithAI } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// ===========================================
// AI FEATURE ROUTES
// These currently return high-quality mock data
// Ready to be wired to real OpenAI / ElevenLabs / Stability
// ===========================================

const aiRequestSchema = z.object({
  type: z.enum(['script', 'story', 'voiceover', 'thumbnail', 'subtitle', 'scene']),
  prompt: z.string().min(5),
  projectId: z.string().optional(),
});

// POST /api/ai/generate
router.post('/generate', authenticate, async (req: AuthRequest, res) => {
  try {
    const { type, prompt, projectId } = aiRequestSchema.parse(req.body);

    const aiRequest = await prisma.aIRequest.create({
      data: {
        userId: req.user!.id,
        projectId,
        type,
        prompt,
        status: 'processing',
      },
    });

    // === REAL AI CALL (falls back to beautiful mock if no key) ===
    const result = await generateWithAI({ type: type as any, prompt });

    await prisma.aIRequest.update({
      where: { id: aiRequest.id },
      data: {
        status: 'completed',
        result,
        completedAt: new Date(),
      },
    });

    res.json({
      requestId: aiRequest.id,
      type,
      result,
      message: `AI ${type} generated successfully`,
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(400).json({ error: 'AI generation failed' });
  }
});

// GET /api/ai/history
router.get('/history', authenticate, async (req: AuthRequest, res) => {
  const history = await prisma.aIRequest.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ history });
});

export default router;
