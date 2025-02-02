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
      return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  };

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        toUserId: parseInt(user.id),
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
            likes: true,
            bookmarks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json(
      { error: 'Hiba történt az értesítések lekérésekor' },
      { status: 500 }
    );
  }
}
