import { QueueEvents } from 'bullmq';
import mongoose from 'mongoose';
import { getRedisClient } from '../config/redis';
import { getSocketIO, emitContentReady } from '../config/socket';
import { ContentService } from './content.service';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'content-generation';

let queueEvents: QueueEvents | null = null;

export const initializeQueueEvents = (): void => {
  if (queueEvents) {
    return; // Already initialized
  }

  const redisClient = getRedisClient();
  queueEvents = new QueueEvents(QUEUE_NAME, {
    connection: redisClient,
  });

  queueEvents.on('completed', async ({ jobId, returnvalue }) => {
    try {
      logger.info(`Job ${jobId} completed, emitting Socket.IO event`);

      // Get content by jobId (populate user for Socket.IO event)
      const contentResult = await ContentService.getContentByJobId(jobId, true);
      
      if (contentResult.success && contentResult.data) {
        const content = contentResult.data;
        // Handle both ObjectId and populated user
        const userId = content.userId instanceof mongoose.Types.ObjectId 
          ? content.userId.toString() 
          : (content.userId as any)?._id?.toString() || (content.userId as any)?.toString();

        // Emit Socket.IO event
        emitContentReady(userId, jobId, {
          id: content._id,
          title: content.title,
          prompt: content.prompt,
          contentType: content.contentType,
          generatedText: content.generatedText,
          createdAt: content.createdAt,
        });
      }
    } catch (error: any) {
      logger.error(`Error emitting Socket.IO event for job ${jobId}:`, error);
    }
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.warn(`Job ${jobId} failed: ${failedReason}`);
  });

  logger.info('Queue events listener initialized');
};

export const closeQueueEvents = async (): Promise<void> => {
  if (queueEvents) {
    await queueEvents.close();
    queueEvents = null;
    logger.info('Queue events listener closed');
  }
};

