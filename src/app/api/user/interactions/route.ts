import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET!) as { id: string };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const interactions = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: {
        likes: { where: { userId: Number(user.id) } },
        bookmarks: { where: { userId: Number(user.id) } },
      },
    });

    if (!interactions) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      liked: interactions.likes.length > 0,
      bookmarked: interactions.bookmarks.length > 0,
    });
    
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
