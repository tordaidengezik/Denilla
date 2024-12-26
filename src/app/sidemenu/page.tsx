"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from "next/image";
import { House, Search, Bell, Bookmark, LogOut } from 'lucide-react';

export default function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const getLinkClass = (path: string) => 
    pathname === path ? 'text-orange-500 font-bold mb-4' : 'text-white mb-4';

  const getIconColor = (path: string) =>
    pathname === path ? "#E8760F" : "#FFFFFF";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="relative w-full md:w-1/4 h-screen bg-dark-gray">
      {/* Navigation Menu */}
      <nav className="p-6 flex flex-col items-center space-y-5">
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

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-between space-x-3 w-[60%] max-w-md border border-gray-600 rounded-full shadow-lg">
        <Link
          href="/profile"
          className="flex items-center justify-start text-white text-base p-2 hover:bg-orange-600 rounded-full transition-all w-full"
        >
          <Image
            src="/yeti_pfp.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-bold text-xl ml-3">Yeti</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-3 text-white text-base hover:bg-red-600  rounded-full "
        >
          <LogOut color="#FFFFFF" size={30} />
        </button>
      </div>
    </div>
  );
}