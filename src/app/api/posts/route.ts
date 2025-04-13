import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Token ellenőrző middleware
const verifyToken = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export async function POST(req: Request) {
  try {
    // Token ellenőrzés
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as File | null;

    if (!content && !file) {
      return NextResponse.json(
        { error: "Tartalom vagy kép szükséges" },
        { status: 400 }
      );
    }

    // Ideiglenes base64 kép tárolás
    let imageURL = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageURL = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: parseInt(userId),
        imageURL,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        likes: true,
        bookmarks: true,
      },
    });

    // MÓDOSÍTOTT RÉSZ - Csak a követők lekérése
    const followers = await prisma.follow.findMany({
      where: {
        followingId: parseInt(userId) // A posztoló felhasználó követői
      },
      select: {
        followerId: true // A követők ID-jai
      }
    });

    // Csak a követőknek küldünk értesítést
    if (followers.length > 0) {
      await prisma.notification.createMany({
        data: followers.map(follower => ({
          toUserId: follower.followerId,
          type: "new_post",
          message: `${post.user.username} created a new post`,
          postId: post.id,
          fromUserId: parseInt(userId) // A posztoló felhasználó ID-ja
        }))
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Hiba történt a poszt létrehozásakor" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    // Token ellenőrzése
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Felhasználó ID kinyerése a tokenből
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = parseInt(decoded.id);

    // Posztok lekérése ahol a user nem egyezik
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: userId, // Kizárjuk a bejelentkezett felhasználó posztjait
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Hiba történt a posztok lekérésekor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    let imageURL = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageURL = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        content,
        ...(imageURL && { imageURL }),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        likes: true,
        bookmarks: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json(
      { error: "Hiba történt a poszt szerkesztésekor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    
    // Tranzakciót használunk, hogy biztosítsuk az atomicitást
    await prisma.$transaction([
      // Először töröljük a kapcsolódó like-okat
      prisma.like.deleteMany({
        where: {
          postId: parseInt(postId),
        },
      }),
      
      // Töröljük a kapcsolódó könyvjelzőket
      prisma.bookmark.deleteMany({
        where: {
          postId: parseInt(postId),
        },
      }),
      
      // Itt törölheted a többi kapcsolódó rekordot (pl. kommenteket, értesítéseket)
      prisma.notification.deleteMany({
        where: {
          postId: parseInt(postId),
        },
      }),
      
      // Végül töröljük magát a posztot
      prisma.post.delete({
        where: {
          id: parseInt(postId),
        },
      }),
    ]);

    return NextResponse.json({ message: "Poszt sikeresen törölve" });
  } catch (error) {
    console.error("Post deletion error:", error);
    return NextResponse.json(
      { error: "Hiba történt a poszt törlésekor" },
      { status: 500 }
    );
  }
}

