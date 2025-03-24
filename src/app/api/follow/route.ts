import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { followingId } = await req.json();

    // 1. Követő felhasználó adatainak lekérése
    const follower = await prisma.user.findUnique({
      where: { id: parseInt(decoded.id) },
      select: { username: true, profileImage: true }
    });

    // 2. Követés létrehozása
    await prisma.follow.create({
      data: {
        followerId: parseInt(decoded.id),
        followingId: parseInt(followingId),
      },
    });

    // 3. Értesítés generálása
    await prisma.notification.create({
      data: {
        toUserId: parseInt(followingId),
        type: 'follow',
        message: `${follower?.username} started following you`,
      },
    });

    return NextResponse.json({ success: true });
  } catch  {
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
