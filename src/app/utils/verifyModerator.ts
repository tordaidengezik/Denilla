import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyModerator(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    });

    return user?.role === "moderator" ? decoded : null;
  } catch {
    return null;
  }
}
