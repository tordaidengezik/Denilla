import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyAdmin } from "@/app/utils/verifyAdmin";

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
      profileImage: true, // Profilkép hozzáadása
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

export async function DELETE(req: Request) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  try {
    // 1. Töröljük a felhasználóhoz kapcsolódó értesítéseket
    await prisma.notification.deleteMany({
      where: { OR: [
        { toUserId: userId },
        { post: { userId: userId } }
      ]}
    });

    // 2. Töröljük a felhasználó összes kapcsolatát
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { userId: userId } }),
      prisma.bookmark.deleteMany({ where: { userId: userId } }),
      prisma.follow.deleteMany({ 
        where: { OR: [
          { followerId: userId },
          { followingId: userId }
        ]}
      }),
      prisma.post.deleteMany({ where: { userId: userId } }),
    ]);

    // 3. Töröljük magát a felhasználót
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Cannot delete user with existing dependencies" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
