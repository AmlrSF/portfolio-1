
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project, { IProject } from '@/models/Project';
import connectDB from '@/lib/connect';

// api/projects/[id]/view/route.ts - Track project views
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ views: project.views });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update views' }, 
      { status: 500 }
    );
  }
}