import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

     await prisma.like.create({
      data: {
        userId: user.id,
        postId: Number(postId),
      },
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { likes: true, bookmarks: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hiba történt a like létrehozásakor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: Number(postId),
        },
      },
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { likes: true, bookmarks: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Hiba történt a like törlésekor' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const likedPosts = await prisma.like.findMany({
      where: {
        userId: user.id
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                username: true,
                profileImage: true
              }
            },
            likes: true,
            bookmarks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });


    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Hiba történt a like-olt posztok lekérésekor' },
      { status: 500 }
    );
  }
}