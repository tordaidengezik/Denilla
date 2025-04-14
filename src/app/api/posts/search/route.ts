import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q');
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const posts = await prisma.post.findMany({
    where: {
      content: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
      },
      likes: true,
      bookmarks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(posts);
}
