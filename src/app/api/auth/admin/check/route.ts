import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return NextResponse.json({ role: decoded.role });
  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json({ role: null }, { status: 401 });
  }
}
