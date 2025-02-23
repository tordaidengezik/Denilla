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

export async function PUT(req: Request) {
    try {
      const token = req.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const userId = parseInt(decoded.id);
      const formData = await req.formData();
  
      // Fájlok kezelése
      const profileImage = formData.get('profileImage') as File;
      const coverImage = formData.get('coverImage') as File;
      
      let profileImageUrl;
      let coverImageUrl;
  
      if (profileImage) {
        const bytes = await profileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        profileImageUrl = `data:${profileImage.type};base64,${buffer.toString('base64')}`;
      }
  
      if (coverImage) {
        const bytes = await coverImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        coverImageUrl = `data:${coverImage.type};base64,${buffer.toString('base64')}`;
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          description: formData.get('description') as string || undefined,
          profileImage: profileImageUrl || undefined,
          coverImage: coverImageUrl || undefined,
        },
        select: {
          username: true,
          description: true,
          profileImage: true,
          coverImage: true
        }
      });
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
  }
  
  