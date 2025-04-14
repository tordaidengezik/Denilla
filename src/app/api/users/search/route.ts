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

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: 'insensitive',
      },
      NOT: {
        id: decoded.id,
      },
    },
    select: {
      id: true,
      username: true,
      profileImage: true,
      followers: {
        where: { followerId: decoded.id },
        select: { id: true },
      },
    },
  });

  const formattedUsers = users.map((user) => ({
    ...user,
    isFollowing: user.followers.length > 0,
  }));

  return NextResponse.json(formattedUsers);
}
