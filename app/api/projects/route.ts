// api/projects/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import Project, { IProject } from '@/models/Project';

import connectDB from '@/lib/connect';

// GET /api/projects - Get all projects with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    const query: any = { status };
    if (category && category !== 'all') {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Execute query with pagination
    const projects = await Project
      .find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Project.countDocuments(query);
    
    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const { title, category, description, image } = body;
    if (!title || !category || !description || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    const project = new Project(body);
    await project.save();
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' }, 
      { status: 500 }
    );
  }
}

