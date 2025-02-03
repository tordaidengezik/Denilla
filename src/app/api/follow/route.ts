import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Follow user
export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { followingId } = await req.json();

    const follow = await prisma.follow.create({
      data: {
        followerId: parseInt(decoded.id),
        followingId: parseInt(followingId),
      },
    });

    return NextResponse.json(follow);
  } catch {
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

// Unfollow user
export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { followingId } = await req.json();

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: parseInt(decoded.id),
          followingId: parseInt(followingId),
        },
      },
    });

    return NextResponse.json({ message: 'Unfollowed successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}
