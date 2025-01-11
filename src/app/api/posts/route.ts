import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Token ellenőrző middleware
const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};


export async function POST(req: Request) {
  try {
    // Token ellenőrzés
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File | null;

    if (!content && !file) {
      return NextResponse.json(
        { error: 'Tartalom vagy kép szükséges' },
        { status: 400 }
      );
    }

    // Ideiglenes base64 kép tárolás
    let imageURL = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageURL = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: parseInt(userId),
        imageURL,
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
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Hiba történt a poszt létrehozásakor' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Token ellenőrzés
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Hiba történt a posztok lekérésekor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const postId = formData.get('postId') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    let imageURL = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageURL = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        content,
        ...(imageURL && { imageURL }),
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
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Post update error:', error);
    return NextResponse.json(
      { error: 'Hiba történt a poszt szerkesztésekor' },
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

    await prisma.post.delete({
      where: {
        id: parseInt(postId),
      },
    });

    return NextResponse.json({ message: 'Poszt sikeresen törölve' });
  } catch (error) {
    console.error('Post deletion error:', error);
    return NextResponse.json(
      { error: 'Hiba történt a poszt törlésekor' },
      { status: 500 }
    );
  }
}