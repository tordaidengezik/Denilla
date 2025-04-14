import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = parseInt(decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        description: true,
        profileImage: true,
        coverImage: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

async function handleImageUpload(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = parseInt(decoded.id);
    const formData = await req.formData();

    const deleteProfileImage = formData.get('deleteProfileImage') === 'true';
    const deleteCoverImage = formData.get('deleteCoverImage') === 'true';
    const description = formData.get('description') as string;

    interface UpdateData {
      description: string | null;
      profileImage?: string | null;
      coverImage?: string | null;
    }

    const updateData: UpdateData = {
      description: description || null,
    };

    if (deleteProfileImage) {
      updateData.profileImage = null;
    } else if (formData.get('profileImage')) {
      const profileImage = formData.get('profileImage') as File;
      const profileImageUrl = await handleImageUpload(profileImage);
      updateData.profileImage = profileImageUrl;
    }

    if (deleteCoverImage) {
      updateData.coverImage = null;
    } else if (formData.get('coverImage')) {
      const coverImage = formData.get('coverImage') as File;
      const coverImageUrl = await handleImageUpload(coverImage);
      updateData.coverImage = coverImageUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        username: true,
        description: true,
        profileImage: true,
        coverImage: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

  