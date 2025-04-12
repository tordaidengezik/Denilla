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

    // Alapértelmezett értesítések lekérése
    const notifications = await prisma.notification.findMany({
      where: { toUserId: parseInt(user.id) },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, profileImage: true } }, // JAVÍTVA: hozzáadtuk az id-t
            likes: true,
            bookmarks: true,
          },
        },
        fromUser: { select: { id: true, username: true, profileImage: true } }, // JAVÍTVA: hozzáadtuk az id-t
      },
      orderBy: { createdAt: "desc" },
    });    

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
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

    const { notificationId } = await req.json();
    
    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
    }

    // Ellenőrizzük, hogy az értesítés a felhasználóhoz tartozik-e
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { toUserId: true }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    if (notification.toUserId !== parseInt(user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Töröljük az értesítést az adatbázisból
    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}

