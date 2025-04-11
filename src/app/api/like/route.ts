import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch {
    return null;
  }
};

export async function POST(req: Request) {
  // POST metódus marad változatlan
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    await prisma.like.create({
      data: {
        userId: user.id,
        postId: Number(postId),
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: { userId: true },
    });

    const liker = await prisma.user.findUnique({
      where: { id: user.id },
      select: { username: true, profileImage: true },
    });

    if (post && post.userId !== user.id) {
      await prisma.notification.create({
        data: {
          toUserId: post.userId,
          type: "like",
          message: `${liker?.username} liked your post`,
          fromUserId: user.id,
          postId: Number(postId),
        },
      });
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { likes: true, bookmarks: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Hiba történt a like létrehozásakor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  // DELETE metódus marad változatlan
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: Number(postId),
        },
      },
    });

    const updatedPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      include: { likes: true, bookmarks: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Hiba történt a like törlésekor" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lekérdezzük, hogy a bejelentkezett felhasználó kiket követ
    const following = await prisma.follow.findMany({
      where: {
        followerId: user.id,  // Akiket a felhasználó követ
      },
      select: {
        followingId: true,
      },
    });

    // Ha senkit nem követ, üres tömböt adunk vissza
    if (following.length === 0) {
      return NextResponse.json([]);
    }

    // Lekérdezzük a követett felhasználók által like-olt posztokat
    const followingIds = following.map(f => f.followingId);
    
    const likedPostsByFollowing = await prisma.like.findMany({
      where: {
        userId: {
          in: followingIds,  // A követett felhasználók által like-olt posztok
        },
      },
      include: {
        user: {  // A like-oló (követett) felhasználó adatai
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        post: {  // A like-olt poszt részletes adatai
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(likedPostsByFollowing);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Hiba történt a követett felhasználók által like-olt posztok lekérésekor" },
      { status: 500 }
    );
  }
}
