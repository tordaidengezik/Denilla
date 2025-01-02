import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, postId } = await req.json();

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json(bookmark);
  } catch {
    return NextResponse.json({ error: 'Hiba történt a könyvjelző létrehozásakor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, postId } = await req.json();

    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return NextResponse.json({ message: 'Könyvjelző sikeresen törölve' });
  } catch {
    return NextResponse.json({ error: 'Hiba történt a könyvjelző törlésekor' }, { status: 500 });
  }
}
