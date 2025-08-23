import { useState, useEffect } from 'react';
import { IProject, ProjectFilters, ApiResponse } from '@/types/project';

export function useProjects(filters: ProjectFilters = {}) {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchProjects = async (newFilters?: ProjectFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      const mergedFilters = { ...filters, ...newFilters };
      
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });

      const response = await fetch(`/api/projects?${params}`);
      const data: ApiResponse<IProject> = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }

      setProjects(data.projects || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Partial<IProject>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      await fetchProjects();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<IProject>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update project');
      }

      await fetchProjects();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}/view`, { method: 'POST' });
      // Optimistically update local state
      setProjects(prev => 
        prev.map(p => p._id === id ? { ...p, views: p.views + 1 } : p)
      );
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  const toggleLike = async (id: string, liked: boolean) => {
    try {
      await fetch(`/api/projects/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked })
      });
      
      // Optimistically update local state
      setProjects(prev => 
        prev.map(p => p._id === id 
          ? { ...p, likes: liked ? p.likes + 1 : p.likes - 1 }
          : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    trackView,
    toggleLike
  };
}

// middleware/auth.ts (Optional: Add authentication)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (request as any).user = decoded;
      
      return handler(request, ...args);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}

// utils/image-upload.ts
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
}

// utils/validation.ts
export const projectValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    message: 'Title must be between 1 and 100 characters'
  },
  category: {
    required: true,
    enum: ['branding', 'poster', 'social', 'illustration'],
    message: 'Invalid category'
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Description must be between 10 and 500 characters'
  },
  image: {
    required: true,
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
    message: 'Must be a valid image URL'
  }
};

export function validateProject(data: any) {
  const errors: { [key: string]: string } = {};

  Object.entries(projectValidationSchema).forEach(([field, rules]) => {
    const value = data[field];

    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
    }

    if (value && rules.enum && !rules.enum.includes(value)) {
      errors[field] = rules.message;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}