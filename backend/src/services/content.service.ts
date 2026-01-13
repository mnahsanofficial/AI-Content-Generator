import Content, { IContent } from '../models/Content';
import mongoose from 'mongoose';
import { ContentType, ContentStatus } from '../types';
import { ApiResponse } from '../types';
import { SentimentResult } from './sentiment.service';

export class ContentService {
  /**
   * Create a new content entry (queued status)
   */
  static async createContent(
    userId: string,
    prompt: string,
    contentType: ContentType,
    jobId: string
  ): Promise<ApiResponse<IContent>> {
    try {
      // Generate a temporary title
      const title = `Content - ${new Date().toLocaleDateString()}`;

      const content = await Content.create({
        userId: new mongoose.Types.ObjectId(userId),
        title,
        prompt,
        contentType,
        generatedText: '',
        status: 'queued',
        jobId,
      });

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create content',
      };
    }
  }

  /**
   * Update content with generated text
   */
  static async updateContentWithGeneratedText(
    jobId: string,
    generatedText: string,
    title?: string,
    status: ContentStatus = 'completed',
    sentiment?: SentimentResult
  ): Promise<ApiResponse<IContent>> {
    try {
      const updateData: any = {
        generatedText,
        status,
      };

      if (title) {
        updateData.title = title;
      }

      if (sentiment) {
        updateData.sentiment = sentiment;
      }

      const content = await Content.findOneAndUpdate(
        { jobId },
        updateData,
        { new: true }
      );

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update content',
      };
    }
  }

  /**
   * Get content by job ID
   */
  static async getContentByJobId(jobId: string, populateUser: boolean = false): Promise<ApiResponse<IContent>> {
    try {
      let query = Content.findOne({ jobId });
      
      if (populateUser) {
        query = query.populate('userId', 'name email');
      }
      
      const content = await query;

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch content',
      };
    }
  }

  /**
   * Get all content for a user
   */
  static async getUserContent(userId: string, searchQuery?: string): Promise<ApiResponse<IContent[]>> {
    try {
      const query: any = { userId: new mongoose.Types.ObjectId(userId) };

      // Add search functionality
      if (searchQuery && searchQuery.trim()) {
        const searchRegex = new RegExp(searchQuery.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { prompt: searchRegex },
          { generatedText: searchRegex },
        ];
      }

      const content = await Content.find(query)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user content',
      };
    }
  }

  /**
   * Get content by ID
   */
  static async getContentById(
    contentId: string,
    userId: string
  ): Promise<ApiResponse<IContent>> {
    try {
      const content = await Content.findOne({
        _id: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(userId),
      }).populate('userId', 'name email');

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch content',
      };
    }
  }

  /**
   * Update content
   */
  static async updateContent(
    contentId: string,
    userId: string,
    updateData: Partial<IContent>
  ): Promise<ApiResponse<IContent>> {
    try {
      const content = await Content.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(contentId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        updateData,
        { new: true, runValidators: true }
      );

      if (!content) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      return {
        success: true,
        data: content,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update content',
      };
    }
  }

  /**
   * Delete content
   */
  static async deleteContent(
    contentId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    try {
      const result = await Content.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!result) {
        return {
          success: false,
          error: 'Content not found',
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete content',
      };
    }
  }
}

