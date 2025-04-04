import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registerUser(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Hiányzó vagy érvénytelen adat.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'A jelszó minimum 6 karakter.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json({ id: newUser.id, message: 'Sikeres regisztráció!' }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A felhasználónév vagy email már létezik.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Adatbázis hiba.' }, { status: 500 });
  }
}

export const POST = registerUser;