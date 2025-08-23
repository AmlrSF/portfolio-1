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
