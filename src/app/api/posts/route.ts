import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File | null;

    // Validáció
    if (!content && !file) {
      return NextResponse.json(
        { error: 'Content or file is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let imageURL = null;
    if (file) {
      try {
        const blob = await put(file.name, file, {
          access: 'public',
        });
        imageURL = blob.url;
      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { error: 'File upload failed' },
          { status: 500 }
        );
      }
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