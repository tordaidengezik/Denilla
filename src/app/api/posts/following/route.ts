import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = parseInt(decoded.id);

    const followingPosts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
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

    return NextResponse.json(followingPosts);
  } catch (error) {
    console.error("Error fetching following posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch following posts" },
      { status: 500 }
    );
  }
}
