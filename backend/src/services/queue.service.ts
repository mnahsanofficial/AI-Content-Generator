import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis';
import { JobData } from '../types';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'content-generation';
const JOB_DELAY_MS = 60000; // 1 minute delay as per requirements

let contentQueue: Queue<JobData> | null = null;

export const getContentQueue = (): Queue<JobData> => {
  if (!contentQueue) {
    const redisClient = getRedisClient();
    
    contentQueue = new Queue<JobData>(QUEUE_NAME, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 1000,
        },
        removeOnFail: {
          age: 86400, // Keep failed jobs for 24 hours
        },
      },
    });

    logger.info('Content generation queue initialized');
  }

  return contentQueue;
};

export const enqueueContentGeneration = async (
  jobData: JobData
): Promise<string> => {
  const queue = getContentQueue();
  
  const job = await queue.add('generate-content', jobData, {
    delay: JOB_DELAY_MS, // 60 second delay as per requirements
  });

  logger.info(`Job ${job.id} enqueued with ${JOB_DELAY_MS}ms delay`);
  
  return job.id!;
};

export const getJobStatus = async (jobId: string) => {
  const queue = getContentQueue();
  const job = await queue.getJob(jobId);

  if (!job) {
    return null;
  }

  const state = await job.getState();
  const progress = job.progress;
  const failedReason = job.failedReason;

  return {
    id: job.id,
    state,
    progress,
    failedReason,
    data: job.data,
  };
};

export const closeQueue = async (): Promise<void> => {
  if (contentQueue) {
    await contentQueue.close();
    contentQueue = null;
    logger.info('Content generation queue closed');
  }
};

