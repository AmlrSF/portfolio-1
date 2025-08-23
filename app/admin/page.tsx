"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Heart, Save, X, Upload, ImageIcon, Lock } from 'lucide-react';

interface Project {
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
}

const AdminProjectManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: 'branding',
    description: '',
    image: '',
    thumbnail: '',
    featured: false,
    status: 'draft',
    tags: [],
    clientName: '',
    projectUrl: '',
    completedAt: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0
  });

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, [filter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';
    
    if (email === adminEmail && password === adminPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('adminAuthenticated', 'true');
      fetchProjects();
    } else {
      setAuthError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setEmail('');
    setPassword('');
  };

  const fetchProjects = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/projects?status=${filter === 'all' ? 'published,draft,archived' : filter}&limit=50`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchProjects();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'branding',
      description: '',
      image: '',
      thumbnail: '',
      featured: false,
      status: 'draft',
      tags: [],
      clientName: '',
      projectUrl: '',
      completedAt: new Date().toISOString().split('T')[0],
      likes: 0,
      views: 0
    });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const categories = [
    { key: 'branding', label: 'Branding' },
    { key: 'poster', label: 'Posters' },
    { key: 'social', label: 'Social Media' },
    { key: 'illustration', label: 'Illustrations' }
  ];

  const statusOptions = [
    { key: 'draft', label: 'Draft', color: 'bg-yellow-500' },
    { key: 'published', label: 'Published', color: 'bg-green-500' },
    { key: 'archived', label: 'Archived', color: 'bg-gray-500' }
  ];

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-600 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access Required</h1>
            <p className="text-white/60 mt-2">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Project Manager</h1>
            <p className="text-white/60">Manage your portfolio projects</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
            >
              Logout
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Rest of your admin interface remains the same */}
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', ...statusOptions.map(s => s.key)].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:border-purple/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white/40" />
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    statusOptions.find(s => s.key === project.status)?.color || 'bg-gray-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-yellow-500 rounded-full text-xs font-medium text-white">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              <div>
                {/* Project Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2 truncate">{project.title}</h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {project.likes}
                      </div>
                    </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {project.views}
                      </div>
                    </div>
                    <span className="capitalize text-purple-400">{project.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id!)}
                      className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
              </motion.div>
            ))}
          </div>

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => handleCloseModal()}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Title */}
                        <div>
                          <label className="block text-white font-medium mb-2">Project Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                            placeholder="Enter project title"
                            required
                          />
                        </div>

                      {/* Category */}
                      <div>
                        <label className="block text-white font-medium mb-2">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.key} value={cat.key} className="bg-slate-800">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-white font-medium mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
                          placeholder="Describe your project"
                          required
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-white font-medium mb-2">Image URL</label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      {/* Client Name */}
                      <div>
                        <label className="block text-white font-medium mb-2">Client Name (Optional)</label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                          placeholder="Client or company name"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={formData.tags?.join(', ')}
                          onChange={(e) => handleTagsChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                          placeholder="design, branding, logo"
                        />
                      </div>

                      {/* Status & Featured */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                          >
                            {statusOptions.map(status => (
                              <option key={status.key} value={status.key} className="bg-slate-800">
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Completed Date</label>
                          <input
                            type="date"
                            value={formData.completedAt?.split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Featured Toggle */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="featured" className="ml-3 text-white font-medium">
                          Featured Project
                        </label>
                      </div>
                      {/* Submit Button */}
                      <div className="flex space-x-4 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50"
                        >
                          <Save className="w-5 h-5 mr-2" />
                          {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      </div>
                    </form>
                  </div>
                  
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
};

export default AdminProjectManager;