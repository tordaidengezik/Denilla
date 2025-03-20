import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// Token ellenőrzés
const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as { id: number };
  } catch {
    return null;
  }
};

// Kommentek lekérése egy poszthoz
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
        select: { username: true, profileImage: true },
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
        postId: parsedPostId, // Integer típusú postId
      },
      include: {
        user: {
          select: { username: true, profileImage: true },
        },
      },
    });
  
    return NextResponse.json(newComment);
  }