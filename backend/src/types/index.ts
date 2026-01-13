import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface JWTPayload extends JwtPayload {
  userId: string;
}

export type ContentType = 'blog' | 'product' | 'caption';

export type ContentStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface GenerateContentRequest {
  prompt: string;
  contentType: ContentType;
}

export interface JobData {
  userId: string;
  prompt: string;
  contentType: ContentType;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

