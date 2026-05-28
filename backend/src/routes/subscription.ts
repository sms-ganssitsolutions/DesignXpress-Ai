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

// POST upgrade (PayPal integration)
router.post('/upgrade', authenticate, async (req: AuthRequest, res) => {
  const { plan } = req.body;

  // In production: Create PayPal order / subscription here using PayPal SDK
  res.json({ 
    success: true, 
    message: `PayPal checkout for ${plan} plan initiated`,
    checkoutUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=demo',
    provider: 'paypal'
  });
});

export default router;
