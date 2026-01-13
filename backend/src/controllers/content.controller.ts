import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { ContentService } from '../services/content.service';

export const getAllContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId!;
    const searchQuery = req.query.search as string | undefined;
    const result = await ContentService.getUserContent(userId, searchQuery);

    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    // Return consistent format with content property
    res.status(200).json({
      success: true,
      data: {
        content: result.data || [],
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getContentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await ContentService.getContentById(id, userId);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    // Return consistent format with content property
    res.status(200).json({
      success: true,
      data: {
        content: result.data,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const updateData = req.body;

    // Only allow updating certain fields
    const allowedFields = ['title', 'generatedText'];
    const filteredData: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const result = await ContentService.updateContent(id, userId, filteredData);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteContent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await ContentService.deleteContent(id, userId);

    if (!result.success) {
      res.status(404).json(result);
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

