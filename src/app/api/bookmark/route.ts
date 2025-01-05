import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JWTPayload {
  id: number;
  email: string;
}

const verifyToken = (req: Request): JWTPayload | null => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
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
    
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        postId: Number(postId),
      },
      include: {
        post: {
          include: {
            user: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    });

    return NextResponse.json(bookmark);
  } catch {
    return NextResponse.json(
      { error: 'Hiba történt a könyvjelző létrehozásakor' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: {
            user: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json(
      { error: 'Hiba történt a könyvjelzők lekérésekor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: Number(postId),
        },
      },
    });

    return NextResponse.json({ message: 'Könyvjelző sikeresen törölve' });
  } catch {
    return NextResponse.json(
      { error: 'Hiba történt a könyvjelző törlésekor' },
      { status: 500 }
    );
  }
}
