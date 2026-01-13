import mongoose, { Schema, Document, Model } from 'mongoose';
import { ContentType, ContentStatus } from '../types';

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  prompt: string;
  contentType: ContentType;
  generatedText: string;
  status: ContentStatus;
  jobId: string;
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  createdAt: Date;
}

const ContentSchema: Schema = new Schema<IContent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['blog', 'product', 'caption'],
      required: [true, 'Content type is required'],
    },
    generatedText: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      index: true,
    },
    jobId: {
      type: String,
      required: [true, 'Job ID is required'],
      unique: true,
      index: true,
    },
    sentiment: {
      score: {
        type: Number,
        min: -1,
        max: 1,
      },
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for user queries
ContentSchema.index({ userId: 1, createdAt: -1 });

const Content: Model<IContent> = mongoose.model<IContent>('Content', ContentSchema);

export default Content;

