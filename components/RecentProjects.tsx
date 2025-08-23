import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Heart, Eye, Filter, Loader2, Clock } from 'lucide-react';

interface Project {
  _id: string;
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

interface ApiResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const DynamicPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const [filter, setFilter] = useState('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { key: 'all', label: 'All Works' },
    { key: 'branding', label: 'Branding' },
    { key: 'poster', label: 'Posters' },
    { key: 'social', label: 'Social Media' },
    { key: 'illustration', label: 'Illustrations' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [filter, currentPage]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'published',
        page: currentPage.toString(),
        limit: '12',
        sortBy: 'featured,createdAt',
        sortOrder: 'desc'
      });

      if (filter !== 'all') {
        params.set('category', filter);
      }

      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch(`/api/projects?${params}`);
      const data: ApiResponse = await response.json();
      
      if (currentPage === 1) {
        setProjects(data.projects);
      } else {
        setProjects(prev => [...prev, ...data.projects]);
      }
      
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
    setLoading(false);
  };

  const handleProjectClick = async (project: Project) => {
    // Track view
    try {
      await fetch(`/api/projects/${project._id}/view`, { method: 'POST' });
      // Update local state
      setProjects(prev => 
        prev.map(p => p._id === project._id ? { ...p, views: p.views + 1 } : p)
      );
    } catch (error) {
      console.error('Failed to track view:', error);
    }
    
    setSelectedImage(project);
  };

  const handleLike = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isLiked = likedProjects.has(project._id);
    const newLikedState = new Set(likedProjects);
    
    if (isLiked) {
      newLikedState.delete(project._id);
    } else {
      newLikedState.add(project._id);
    }
    
    setLikedProjects(newLikedState);

    try {
      await fetch(`/api/projects/${project._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: !isLiked })
      });

      // Update local state
      setProjects(prev => 
        prev.map(p => p._id === project._id 
          ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 }
          : p
        )
      );
    } catch (error) {
      console.error('Failed to update like:', error);
      // Revert optimistic update
      setLikedProjects(likedProjects);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
    setProjects([]);
  };

  const loadMoreProjects = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getCategoryGradient = (category: string, index: number) => {
    const gradients = {
      branding: 'from-purple-600 to-blue-600',
      poster: 'from-pink-600 to-red-600',
      social: 'from-blue-600 to-cyan-600',
      illustration: 'from-green-600 to-emerald-600'
    };
    return gradients[category as keyof typeof gradients] || 'from-gray-600 to-slate-600';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Skeleton component for loading state
  const SkeletonCard = ({ index }: { index: number }) => {
    const delay = index * 0.1;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="relative rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 overflow-hidden backdrop-blur-sm"
      >
        <div className="aspect-square relative animate-pulse bg-gradient-to-br from-gray-800 to-gray-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-white/10 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-full animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-2/3 animate-pulse"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-white/10 rounded-full w-16 animate-pulse"></div>
            <div className="h-5 bg-white/10 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-20 px-4" id="projects">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            My Creative <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          
          <p className="text-white/70 mb-8 max-w-2xl mx-auto text-lg">
            Explore my collection of creative projects including brand identities, 
            posters, social media graphics, and digital illustrations.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.key}
                onClick={() => handleFilterChange(category.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  filter === category.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 text-white/70 border-white/20 hover:border-purple-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading State - Skeleton */}
        {loading && projects.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} index={index} />
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 h-full">
                  {/* Project Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback gradient */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(project.category, index)} flex items-center justify-center ${project.image ? 'hidden' : ''}`}
                    >
                      <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🎨</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white">{project.title}</h3>
                        <p className="text-sm opacity-80 text-white/80">{project.description}</p>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    >
                      <div className="text-center p-6 w-full">
                        <div className="flex items-center justify-center space-x-6 mb-4">
                          <motion.button
                            onClick={(e) => handleLike(project, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center transition-colors ${
                              likedProjects.has(project._id) ? 'text-red-400' : 'text-white/80 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              className={`w-5 h-5 mr-1 ${likedProjects.has(project._id) ? 'fill-current' : ''}`} 
                            />
                            <span className="font-medium">{project.likes}</span>
                          </motion.button>
                          
                          <div className="flex items-center text-white/80">
                            <Eye className="w-5 h-5 mr-1" />
                            <span className="font-medium">{project.views}</span>
                          </div>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 20 }}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Project
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full shadow-lg"
                        >
                          ⭐ Featured
                        </motion.span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white/90 border border-white/20 font-medium">
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-1 truncate">
                      {project.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-2 mb-2">
                      {project.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      {project.clientName && (
                        <p className="text-purple-400 text-xs font-medium">
                          Client: {project.clientName}
                        </p>
                      )}
                      
                      {/* Added completion date */}
                      {project.completedAt && (
                        <p className="text-white/40 text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(project.completedAt)}
                        </p>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full hover:bg-purple-500/20 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/5 text-white/50 text-xs rounded-full">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Stats bar at bottom */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center text-white/50 text-xs">
                        <Heart className={`w-4 h-4 mr-1 ${likedProjects.has(project._id) ? 'text-red-400 fill-current' : ''}`} />
                        <span>{project.likes}</span>
                      </div>
                      <div className="flex items-center text-white/50 text-xs">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{project.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="text-center mt-12">
            <motion.button 
              onClick={loadMoreProjects}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                  Loading...
                </>
              ) : (
                `Load More Projects (${projects.length} of ${totalPages * 12})`
              )}
            </motion.button>
          </div>
        )}

        {/* No Projects Message */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-white/60">Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>

      {/* Modal for full-screen view */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center overflow-hidden">
                  {selectedImage.image ? (
                    <img 
                      src={selectedImage.image} 
                      alt={selectedImage.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🎨</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full font-medium">
                      {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                    </span>
                    {selectedImage.featured && (
                      <span className="ml-2 px-3 py-1 bg-yellow-500 text-black text-sm rounded-full font-bold">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-4">{selectedImage.title}</h2>
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">{selectedImage.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedImage.clientName && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/50 text-sm">Client</p>
                        <p className="text-purple-400 font-medium">{selectedImage.clientName}</p>
                      </div>
                    )}
                    
                    {selectedImage.completedAt && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/50 text-sm">Completed On</p>
                        <p className="text-white font-medium">{formatDate(selectedImage.completedAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-8 mb-6">
                    <div className="flex items-center text-white/60">
                      <Heart className={`w-6 h-6 mr-2 ${likedProjects.has(selectedImage._id) ? 'text-red-400 fill-current' : 'text-red-400'}`} />
                      <span className="text-xl font-medium">{selectedImage.likes} likes</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Eye className="w-6 h-6 mr-2 text-blue-400" />
                      <span className="text-xl font-medium">{selectedImage.views} views</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedImage.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm hover:bg-purple-500/20 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      onClick={(e) => handleLike(selectedImage, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                        likedProjects.has(selectedImage._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${likedProjects.has(selectedImage._id) ? 'fill-current' : ''}`} />
                      {likedProjects.has(selectedImage._id) ? 'Liked' : 'Like'}
                    </motion.button>
                    
                    {selectedImage.projectUrl && (
                      <motion.a
                        href={selectedImage.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        View Live
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicPortfolio;