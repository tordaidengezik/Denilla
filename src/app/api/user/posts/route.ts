import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = parseInt(decoded.id);

    const userPosts = await prisma.post.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        likes: true,
        bookmarks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Hiba történt a posztok lekérésekor' },
      { status: 500 }
    );
  }
}
