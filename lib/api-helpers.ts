import { NextResponse } from 'next/server';

export function handleError(error: any, defaultMessage = 'An error occurred') {
  console.error(error);
  
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
  
  if (error.name === 'CastError') {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: defaultMessage },
    { status: 500 }
  );
}

export function validateRequired(data: any, requiredFields: string[]) {
  const missing = requiredFields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function sanitizeProject(project: any) {
  return {
    title: project.title?.trim(),
    category: project.category,
    description: project.description?.trim(),
    image: project.image?.trim(),
    thumbnail: project.thumbnail?.trim(),
    featured: Boolean(project.featured),
    status: project.status || 'draft',
    tags: Array.isArray(project.tags) ? project.tags.map((tag: string) => tag.trim()).filter(Boolean) : [],
    clientName: project.clientName?.trim(),
    projectUrl: project.projectUrl?.trim(),
    completedAt: project.completedAt ? new Date(project.completedAt) : new Date(),
    likes: Number(project.likes) || 0,
    views: Number(project.views) || 0
  };
}