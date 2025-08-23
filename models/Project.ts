// models/Project.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: 'branding' | 'poster' | 'social' | 'illustration';
  description: string;
  image: string;
  thumbnail?: string;
  likes: number;
  views: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  clientName?: string;
  projectUrl?: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: ['branding', 'poster', 'social', 'illustration']
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  image: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  clientName: {
    type: String,
    trim: true
  },
  projectUrl: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);