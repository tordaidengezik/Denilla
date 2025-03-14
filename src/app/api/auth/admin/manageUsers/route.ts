import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/app/utils/verifyAdmin';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json(users);
}

export async function PUT(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.json(updatedUser);
}
