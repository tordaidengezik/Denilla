import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user?.role === "moderator") {
      return NextResponse.json({ role: "moderator" });
    }

    return NextResponse.json({ role: null }, { status: 403 });
  } catch (error) {
    console.error("Moderator check error:", error);
    return NextResponse.json({ role: null }, { status: 401 });
  }
}
