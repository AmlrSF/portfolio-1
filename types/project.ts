export interface IProject {
  _id?: string;
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
  completedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data?: T;
  projects?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
  message?: string;
}
