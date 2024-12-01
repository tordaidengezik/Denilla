"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import { House, Search, Bell, Bookmark } from 'lucide-react';

export default function SideMenu() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => 
    pathname === path ? 'text-orange-500 font-bold mb-4' : 'text-white mb-4';

  const getIconColor = (path: string) =>
    pathname === path ? "#E8760F" : "#FFFFFF";

  return (
      <nav className="w-full md:w-1/4 h-full md:h-full bg-dark-gray p-6 flex flex-col items-center space-y-5">
        <div className="flex flex-col items-start">
          <div className="flex-shrink-0 mb-4">
            <Link href="/">
              <Image
                src="/Denilla.png"
                alt="Logo"
                width={30}
                height={30}
                className="rounded-full"
              />
            </Link>
          </div>

          <Link href="post" className={getLinkClass('/post')}>
            <div className="flex items-center space-x-3">
              <House color={getIconColor('/post')} size={30} />
              <span>Home</span>
            </div>
          </Link>

          <Link href="/" className={getLinkClass('/following')}>
            <div className="flex items-center space-x-3">
              <Search color={getIconColor('/following')} size={30} />
              <span>Search</span>
            </div>
          </Link>

          <Link href="/" className={getLinkClass('/foryou')}>
            <div className="flex items-center space-x-3">
              <Bell color={getIconColor('/foryou')} size={30} />
              <span>Notifications</span>
            </div>
          </Link>

          <Link href="/" className={getLinkClass('/foryou')}>
            <div className="flex items-center space-x-3">
              <Bookmark color={getIconColor('/foryou')} size={30} />
              <span>Bookmarks</span>
            </div>
          </Link>

          <Link href="createPost">
            <button className="bg-orange-500 text-white px-4 py-2 w-40 rounded-xl hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all">
              Post
            </button>
          </Link>

        </div>
      </nav>
  );
}