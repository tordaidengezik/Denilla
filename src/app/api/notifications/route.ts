import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Alapértelmezett értesítések lekérése
    const notifications = await prisma.notification.findMany({
      where: { toUserId: parseInt(user.id) },
      include: {
        post: {
          include: {
            user: { select: { username: true, profileImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
