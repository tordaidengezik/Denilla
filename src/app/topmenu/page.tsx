"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopMenu() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex justify-between bg-dark-gray border-b border-gray-500 p-2 z-10">
      <div className="flex-grow flex justify-around">
        <Link
          href="/foryou"
          className={`w-20 text-center ${pathname === '/foryou' ? 'text-orange-650 font-bold' : 'text-white'}`}>
          For You
        </Link>
        <Link
          href="/following"
          className={`w-20 text-center ${pathname === '/following' ? 'text-orange-650 font-bold' : 'text-white'}`}>
          Following
        </Link>
      </div>
    </nav>
  );
}

