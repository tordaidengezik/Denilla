import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, postId } = await req.json();

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hiba történt a like létrehozásakor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, postId } = await req.json();

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hiba történt a like törlésekor' }, { status: 500 });
  }
}
