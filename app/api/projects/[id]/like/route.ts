
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project, { IProject } from '@/models/Project';
import connectDB from '@/lib/connect';



// api/projects/[id]/like/route.ts - Toggle project like
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const { liked } = await request.json();
    
    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { likes: liked ? 1 : -1 } },
      { new: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ likes: project.likes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update likes' }, 
      { status: 500 }
    );
  }
}