import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// Bővített token ellenőrzés szerepkör információval
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

// Kommentek lekérése egy poszthoz
// Kommentek lekérése egy poszthoz
export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  // Összes komment lekérése egy poszthoz
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


// Új komment létrehozása
export async function POST(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, content } = await req.json();

  if (!postId || !content) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Konvertáljuk a postId-t Integer típusra
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

// Komment szerkesztése
export async function PUT(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId, content } = await req.json();

  if (!commentId || !content) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Komment adatok lekérése
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    select: { userId: true }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Jogosultság ellenőrzése
  const isCommentOwner = comment.userId === user.id;
  const isAdmin = user.role === 'admin';
  const isModerator = user.role === 'moderator';

  if (!isCommentOwner && !isAdmin && !isModerator) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  // Komment frissítése
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

// Komment törlése
export async function DELETE(req: Request) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await req.json();

  if (!commentId) {
    return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
  }

  // Komment adatok lekérése
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    select: { userId: true }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Jogosultság ellenőrzése - csak tulajdonos vagy admin törölhet
  const isCommentOwner = comment.userId === user.id;
  const isAdmin = user.role === 'admin';

  if (!isCommentOwner && !isAdmin) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  // Komment törlése
  await prisma.comment.delete({
    where: { id: Number(commentId) }
  });

  return NextResponse.json({ success: true });
}
