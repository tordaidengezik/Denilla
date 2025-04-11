import { NextResponse } from "next/server";
import { verifyModerator } from "@/app/utils/verifyModerator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const moderator = await verifyModerator(req);
  if (!moderator) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          username: true,
          profileImage: true,
        },
      },
      likes: true,
      bookmarks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(posts);
}

export async function PUT(req: Request) {
  const moderator = await verifyModerator(req);
  if (!moderator) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, newContent, imageURL } = await req.json();

  if (!postId || !newContent) {
    return NextResponse.json({ error: "Hiányzó adatok" }, { status: 400 });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { 
      content: newContent,
      imageURL: imageURL
    },
  });

  return NextResponse.json(updatedPost);
}

