import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET current subscription
router.get('/', authenticate, async (req: AuthRequest, res) => {
  const sub = await prisma.subscription.findFirst({
    where: { userId: req.user!.id },
  });

  res.json({ 
    subscription: sub || { 
      plan: 'creator', 
      status: 'active' 
    } 
  });
});

// POST upgrade (stub - would integrate with Stripe later)
router.post('/upgrade', authenticate, async (req: AuthRequest, res) => {
  const { plan } = req.body;

  // In real app: create Stripe checkout session here
  res.json({ 
    success: true, 
    message: `Upgrade to ${plan} initiated (Stripe checkout would open here)`,
    checkoutUrl: '/billing?success=true' 
  });
});

export default router;
