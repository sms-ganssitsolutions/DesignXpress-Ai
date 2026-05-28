import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { renderVideo } from './ffmpegService';
import { PrismaClient } from '@prisma/client';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const prisma = new PrismaClient();

export const exportQueue = new Queue('video-exports', { connection });

// Worker that processes export jobs
export const exportWorker = new Worker(
  'video-exports',
  async (job: Job) => {
    const { exportJobId, projectId, scenes, options } = job.data;

    try {
      await prisma.exportJob.update({
        where: { id: exportJobId },
        data: { status: 'processing', progress: 10 },
      });

      await job.updateProgress(20);

      // Actual render
      const outputPath = await renderVideo(projectId, scenes, options);

      await job.updateProgress(90);

      const publicUrl = outputPath.startsWith('http') ? outputPath : `/uploads${outputPath.replace('./uploads', '')}`;

      await prisma.exportJob.update({
        where: { id: exportJobId },
        data: {
          status: 'completed',
          progress: 100,
          outputUrl: publicUrl,
          completedAt: new Date(),
        },
      });

      await job.updateProgress(100);

      return { outputUrl: publicUrl };
    } catch (error: any) {
      await prisma.exportJob.update({
        where: { id: exportJobId },
        data: {
          status: 'failed',
          error: error.message || 'Render failed',
          completedAt: new Date(),
        },
      });

      throw error; // Let BullMQ mark as failed
    }
  },
  { connection, concurrency: 2 } // allow 2 concurrent renders
);

// Add job to queue
export async function queueExportJob(data: {
  userId: string;
  projectId: string;
  scenes: any[];
  options?: any;
}) {
  const exportJob = await prisma.exportJob.create({
    data: {
      userId: data.userId,
      projectId: data.projectId,
      status: 'queued',
      options: data.options || {},
    },
  });

  await exportQueue.add(
    'render-video',
    {
      exportJobId: exportJob.id,
      projectId: data.projectId,
      scenes: data.scenes,
      options: data.options,
    },
    {
      attempts: 2,
      backoff: { type: 'exponential', delay: 5000 },
    }
  );

  return exportJob;
}

export async function getExportStatus(exportJobId: string) {
  return prisma.exportJob.findUnique({ where: { id: exportJobId } });
}

export async function getUserExports(userId: string) {
  return prisma.exportJob.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
