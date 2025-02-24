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
    const currentUserId = parseInt(decoded.id);

    // Get all users except the current user, including follow status
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUserId,
        },
      },
      select: {
        id: true,
        username: true,
        profileImage: true,
        followers: {
          where: {
            followerId: currentUserId,
          },
        },
      },
    });

    // Transform the data to include isFollowing status
    const usersWithFollowStatus = users.map((user) => ({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage,
      isFollowing: user.followers.length > 0,
    }));

    return NextResponse.json(usersWithFollowStatus);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
