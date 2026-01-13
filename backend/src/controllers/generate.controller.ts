import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { AuthRequest } from '../types';
import { ContentService } from '../services/content.service';
import { enqueueContentGeneration, getJobStatus } from '../services/queue.service';
import { logger } from '../utils/logger';

export const generateContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { prompt, contentType } = req.body;
    const userId = req.userId!;

    // Enqueue job with 60 second delay
    const jobId = await enqueueContentGeneration({
      userId,
      prompt,
      contentType,
    });

    // Create content entry with queued status
    const contentResult = await ContentService.createContent(
      userId,
      prompt,
      contentType,
      jobId
    );

    if (!contentResult.success) {
      res.status(500).json(contentResult);
      return;
    }

    // Return 202 Accepted with job info
    res.status(202).json({
      success: true,
      data: {
        jobId,
        status: 'queued',
        estimatedDelay: 60000, // 60 seconds
        contentId: contentResult.data?._id,
      },
    });
  } catch (error: any) {
    logger.error('Error in generateContent:', error);
    next(error);
  }
};

export const getContentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.userId!;

    // Get job status from queue
    const jobStatus = await getJobStatus(jobId);

    if (!jobStatus) {
      res.status(404).json({
        success: false,
        error: 'Job not found',
      });
      return;
    }

    // Get content from database (don't populate userId for ownership check)
    const contentResult = await ContentService.getContentByJobId(jobId, false);

    if (!contentResult.success) {
      res.status(404).json({
        success: false,
        error: 'Content not found',
      });
      return;
    }

    const content = contentResult.data!;

    // Verify ownership - handle both ObjectId and populated user
    const contentUserId = content.userId instanceof mongoose.Types.ObjectId 
      ? content.userId.toString() 
      : (content.userId as any)?._id?.toString() || (content.userId as any)?.toString();
    
    if (contentUserId !== userId) {
      res.status(403).json({
        success: false,
        error: 'Access denied',
      });
      return;
    }

    // Map queue state to content status
    let status = content.status;
    if (jobStatus.state === 'completed' && content.status === 'queued') {
      status = 'processing';
    } else if (jobStatus.state === 'failed') {
      status = 'failed';
    } else if (jobStatus.state === 'completed' && content.status === 'completed') {
      status = 'completed';
    }

    const response: any = {
      success: true,
      data: {
        jobId,
        status,
        queueState: jobStatus.state,
      },
    };

    // Include content if completed
    if (status === 'completed' && content.generatedText) {
      response.data.content = {
        id: content._id,
        title: content.title,
        prompt: content.prompt,
        contentType: content.contentType,
        generatedText: content.generatedText,
        createdAt: content.createdAt,
      };
    }

    res.status(200).json(response);
  } catch (error: any) {
    logger.error('Error in getContentStatus:', error);
    next(error);
  }
};

// Validation middleware
export const validateGenerateContent = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 5, max: 2000 })
    .withMessage('Prompt must be between 5 and 2000 characters'),
  body('contentType')
    .isIn(['blog', 'product', 'caption'])
    .withMessage('Content type must be one of: blog, product, caption'),
];

