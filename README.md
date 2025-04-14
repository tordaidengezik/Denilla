# 🚀 Denilla Social Media Platform

Egy modern közösségi média platform, ahol felhasználók posztokat hozhatnak létre, egymást követhetik.

---

## 🌟 Főbb funkciók
- 👤 **Felhasználókezelés**: Regisztráció, bejelentkezés, profil szerkesztés
- 📝 **Posztok létrehozása**: Szöveges és képes posztok
- ❤️ **Interakciók**: Like, kommentelés, könyvjelzőzés
- 🛠️ **Moderátori felület**: Tartalomkezeléshez
- 🔔 **Valós idejű értesítések**

---

## 🛠️ Technológiai verem
- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Adatbázis**: PostgreSQL, Prisma ORM
- **Tesztelés**: Cypress
- **Telepítés**: Docker

---

## 📦 Telepítés helyi környezetben

### ⚙️ Előfeltételek
- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/) 14+
- [Docker](https://www.docker.com/) (opcionális)

### 1️⃣ **Csomagok telepítése**
```bash
npm install next@latest react@latest react-dom@latest
```

### 2️⃣ **Adatbázis konfiguráció**
```bash
1: Hozz létre egy .env fájlt a projekt gyökerében, és add hozzá a következőket:
DATABASE_URL="postgresql://postgres:mysecretpassword@127.0.0.1:5432/postgres?schema=public"
JWT_SECRET=f3c7f103ff0df87e3b3ffdd983a9ef68a07df4e0d5ccbb80c2c94bf29d36dfb2

2: Prisma inicializálása:
npm i -g prisma
prisma generate
prisma db push
```

### 3️⃣ **Admin felhasználó létrehozása**
```bash
npx prisma db seed
```
### 4️⃣ **Alkalmazás indítása**
```bash
npm run dev
Az alkalmazás elérhető lesz a http://localhost:3000 címen
```
### ✅ **Tesztek futtatása**
```bash
npx cypress run
```
