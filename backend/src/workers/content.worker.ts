// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../config/redis';
import { connectDatabase } from '../config/database';
import { JobData } from '../types';
import { AIService } from '../services/ai.service';
import { ContentService } from '../services/content.service';
import { SentimentService } from '../services/sentiment.service';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'content-generation';

// Connect to database
connectDatabase().catch((error) => {
  logger.error('Failed to connect to database:', error);
  process.exit(1);
});

const redisClient = getRedisClient();

const worker = new Worker<JobData>(
  QUEUE_NAME,
  async (job: Job<JobData>) => {
    const { userId, prompt, contentType } = job.data;

    logger.info(`Processing job ${job.id} for user ${userId}`);

    try {
      // Update status to processing
      await ContentService.updateContentWithGeneratedText(
        job.id!,
        '',
        undefined,
        'processing'
      );

      // Generate content using OpenAI
      const generatedText = await AIService.generateContent(prompt, contentType);

      // Generate title from content
      const title = await AIService.generateTitle(generatedText);

      // Analyze sentiment of generated content
      const sentiment = SentimentService.analyzeSentiment(generatedText);

      // Update content with generated text, title, and sentiment
      const result = await ContentService.updateContentWithGeneratedText(
        job.id!,
        generatedText,
        title,
        'completed',
        sentiment
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update content');
      }

      logger.info(`Job ${job.id} completed successfully`);
      return { success: true, contentId: result.data?._id };
    } catch (error: any) {
      logger.error(`Job ${job.id} failed:`, error);

      // Update status to failed
      await ContentService.updateContentWithGeneratedText(
        job.id!,
        '',
        undefined,
        'failed'
      ).catch((updateError) => {
        logger.error('Failed to update content status to failed:', updateError);
      });

      throw error;
    }
  },
  {
    connection: redisClient,
    concurrency: 5, // Process up to 5 jobs concurrently
    limiter: {
      max: 10, // Max 10 jobs
      duration: 60000, // Per minute (to respect OpenAI rate limits)
    },
  }
);

worker.on('completed', (job: Job) => {
  logger.info(`Job ${job.id} has been completed`);
});

worker.on('failed', (job: Job | undefined, error: Error) => {
  logger.error(`Job ${job?.id} has failed:`, error);
});

worker.on('error', (error: Error) => {
  logger.error('Worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing worker...');
  await worker.close();
  process.exit(0);
});

logger.info('✅ Content generation worker started and listening for jobs...');

