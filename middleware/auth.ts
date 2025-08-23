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
