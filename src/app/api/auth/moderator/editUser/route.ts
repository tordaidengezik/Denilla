// app/api/auth/moderator/editUser/route.ts
import { NextResponse } from "next/server";
import { verifyModerator } from "@/app/utils/verifyModerator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const moderator = await verifyModerator(req);
  if (!moderator) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, newUsername } = await req.json();

  if (!userId || !newUsername) {
    return NextResponse.json({ error: "Hiányzó adatok" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username: newUsername },
  });

  return NextResponse.json(updatedUser);
}

export async function GET(req: Request) {
  const moderator = await verifyModerator(req);
  if (!moderator) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });

  return NextResponse.json(users);
}
