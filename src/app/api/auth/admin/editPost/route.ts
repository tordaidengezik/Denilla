import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "@/app/utils/verifyAdmin";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin-ként minden posztot lekérdezhetünk
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      userId: true,
      createdAt: true
    }
  });

  return NextResponse.json(posts);
}

export async function PUT(req: Request) {
  const user = await verifyAdmin(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, newContent, imageURL } = await req.json();

  if (!postId || !newContent) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const updateData: { content: string; imageURL?: string } = {
      content: newContent
    };

    if (imageURL !== undefined) {
      updateData.imageURL = imageURL;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

