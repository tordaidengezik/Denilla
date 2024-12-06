import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Hiányzó bejelentkezési adatok.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user  !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Helytelen felhasználónév vagy jelszó.' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, message: 'Sikeres bejelentkezés!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Adatbázis hiba.' }, { status: 500 });
  }
}