import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Ellenőrizzük a token meglétét
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Token dekódolása és a bejelentkezett felhasználó ID-jának lekérése
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const currentUserId = parseInt(decoded.id);

    // Lekérjük az összes felhasználót (kivéve a bejelentkezett felhasználót)
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
            followerId: currentUserId, // Csak azok a követések, ahol a bejelentkezett felhasználó követi az adott felhasználót
          },
        },
      },
    });

    // Átalakítjuk az adatokat, hogy tartalmazzák az isFollowing státuszt
    const usersWithFollowStatus = users.map((user) => ({
      id: user.id,
      username: user.username,
      profileImage: user.profileImage || "/yeti_pfp.jpg", // Alapértelmezett kép, ha nincs profilkép
      isFollowing: user.followers.length > 0, // Ha van követés, akkor true
    }));

    return NextResponse.json(usersWithFollowStatus);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
