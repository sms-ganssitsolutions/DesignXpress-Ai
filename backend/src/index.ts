import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import aiRoutes from './routes/ai';
import uploadRoutes from './routes/upload';
import exportRoutes from './routes/export';
import subscriptionRoutes from './routes/subscription';
import templatesRoutes from './routes/templates';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ===========================================
// MIDDLEWARE
// ===========================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// Request logger (dev)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ===========================================
// ROUTES
// ===========================================
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'DesignXpress AI Backend',
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/templates', templatesRoutes);

// ===========================================
// SOCKET.IO - Real-time Collaboration (v0.6)
// ===========================================
const activeUsers = new Map<string, { userId: string; name: string; color: string }>();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-project', ({ projectId, user }: { projectId: string; user: any }) => {
    socket.join(`project:${projectId}`);
    
    const userData = {
      userId: user?.id || socket.id,
      name: user?.name || 'Anonymous Creator',
      color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
    };
    
    activeUsers.set(socket.id, userData);
    
    // Notify others
    socket.to(`project:${projectId}`).emit('user-joined', userData);
    socket.emit('active-users', Array.from(activeUsers.values()));
    
    console.log(`${userData.name} joined project ${projectId}`);
  });

  // Real-time cursor position
  socket.on('cursor-move', ({ projectId, x, y }) => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      socket.to(`project:${projectId}`).emit('cursor-update', {
        userId: userData.userId,
        name: userData.name,
        color: userData.color,
        x, y,
      });
    }
  });

  // Live scene updates
  socket.on('scene-update', (data) => {
    socket.to(`project:${data.projectId}`).emit('scene-updated', {
      ...data,
      updatedBy: activeUsers.get(socket.id)?.name || 'Someone',
    });
  });

  // Real-time team chat
  socket.on('chat-message', ({ projectId, name, text }) => {
    socket.to(`project:${projectId}`).emit('chat-message', {
      name,
      text,
      ts: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      // Broadcast user left to all rooms
      io.emit('user-left', userData.userId);
      activeUsers.delete(socket.id);
    }
    console.log('Socket disconnected:', socket.id);
  });
});

// ===========================================
// ERROR HANDLER
// ===========================================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// ===========================================
// START SERVER
// ===========================================
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   DESIGNXPRESS AI BACKEND                                  ║
║   Running on http://localhost:${PORT}                         ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
