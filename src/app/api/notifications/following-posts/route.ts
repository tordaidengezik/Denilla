import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Közvetlen lekérdezés a követett felhasználók posztjainak értesítéseihez
    const followingPostNotifications = await prisma.notification.findMany({
      where: {
        toUserId: parseInt(user.id),
        type: "new_post",
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
            likes: true,
            bookmarks: true,
          },
        },
        fromUser: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2. Debug információ
    console.log(
      `Found ${followingPostNotifications.length} following post notifications for user ${user.id}`
    );

    return NextResponse.json(followingPostNotifications);
  } catch (error) {
    console.error("Error fetching following post notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
