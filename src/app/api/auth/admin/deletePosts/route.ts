import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "@/app/utils/verifyAdmin";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({ message: "Post deleted successfully" });
}

export async function GET(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          username: true,
          profileImage: true, // Profilkép hozzáadása
        },
      },
      likes: true,
      bookmarks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

