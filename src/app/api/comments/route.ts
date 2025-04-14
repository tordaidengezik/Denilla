import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as { id: number, role?: string };
  } catch {
    return null;
  }
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      user: {
        select: { username: true, profileImage: true, id: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments);
}


export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, content } = await req.json();

  if (!postId || !content) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const parsedPostId = parseInt(postId, 10);

  if (isNaN(parsedPostId)) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      postId: parsedPostId,
    },
    include: {
      user: {
        select: { username: true, profileImage: true, id: true },
      },
    },
  });

  return NextResponse.json(newComment);
}

export async function PUT(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId, content } = await req.json();

  if (!commentId || !content) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    select: { userId: true }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const isCommentOwner = comment.userId === user.id;
  const isAdmin = user.role === 'admin';
  const isModerator = user.role === 'moderator';

  if (!isCommentOwner && !isAdmin && !isModerator) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: { content },
    include: {
      user: {
        select: { username: true, profileImage: true, id: true },
      },
    }
  });

  return NextResponse.json(updatedComment);
}

export async function DELETE(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await req.json();

  if (!commentId) {
    return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    select: { userId: true }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const isCommentOwner = comment.userId === user.id;
  const isAdmin = user.role === 'admin';

  if (!isCommentOwner && !isAdmin) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  await prisma.comment.delete({
    where: { id: Number(commentId) }
  });

  return NextResponse.json({ success: true });
}
