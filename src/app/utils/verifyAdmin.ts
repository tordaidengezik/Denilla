import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const verifyAdmin = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user?.role === 'admin') {
      return user;
    }

    return null;
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
};
