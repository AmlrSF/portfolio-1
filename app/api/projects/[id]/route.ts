// api/projects/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import Project, { IProject } from '@/models/Project';

import connectDB from '@/lib/connect';

// api/projects/[id]/route.ts
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const project = await Project.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' }, 
      { status: 500 }
    );
  }
}

