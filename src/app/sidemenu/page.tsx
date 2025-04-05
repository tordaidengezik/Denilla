"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  House,
  Search,
  Bell,
  Bookmark,
  LogOut,
  X,
  UserRound,
} from "lucide-react";
import CreatePostModal from "../createPost/createPost";

interface User {
  username: string;
  profileImage: string;
}

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: "",
    profileImage: "/yeti_pfp.jpg",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLinkClass = (path: string) =>
    path === "/foryou" && (pathname === "/foryou" || pathname === "/following")
      ? "text-orange-650 font-bold mb-4"
      : pathname === path
      ? "text-orange-650 font-bold mb-4"
      : "text-white mb-4";

  const getIconColor = (path: string) =>
    path === "/foryou" && (pathname === "/foryou" || pathname === "/following")
      ? "#F84F08"
      : pathname === path
      ? "#F84F08"
      : "#FFFFFF";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/auth/admin/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const checkModerator = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/auth/moderator/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsModerator(true);
        } else {
          setIsModerator(false);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        setIsModerator(false);
      }
    };

    checkModerator();
  }, []);

  return (
    <>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-600 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Are you sure to logout?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all w-full sm:w-36"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700 transition-all w-full sm:w-36"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hamburger gomb */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-full"
        aria-label="Menü nyitása"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Reszponzív menü konténer */}
      <div
        className={`
          fixed lg:relative
          z-50
          h-screen bg-dark-gray
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 lg:w-1/4
        `}
      >
        <div className="relative w-full h-screen bg-dark-gray">
          <nav className="p-6 flex flex-col items-center space-y-5">
            <div className="flex flex-col items-start">
              <div className="flex-shrink-0 mb-4">
                <Link href="/foryou">
                  <Image
                    src="/Denilla.png"
                    alt="Logo"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </Link>
              </div>

              <Link href="/foryou" className={getLinkClass("/foryou")}>
                <div className="flex items-center space-x-3">
                  <House color={getIconColor("/foryou")} size={30} />
                  <span>Home</span>
                </div>
              </Link>

              <Link href="/search" className={getLinkClass("/search")}>
                <div className="flex items-center space-x-3">
                  <Search color={getIconColor("/search")} size={30} />
                  <span>Search</span>
                </div>
              </Link>

              <Link
                href="/notifications"
                className={getLinkClass("/notifications")}
              >
                <div className="flex items-center space-x-3">
                  <Bell color={getIconColor("/notifications")} size={30} />
                  <span>Notifications</span>
                </div>
              </Link>

              <Link href="/bookmarks" className={getLinkClass("/bookmarks")}>
                <div className="flex items-center space-x-3">
                  <Bookmark color={getIconColor("/bookmarks")} size={30} />
                  <span>Bookmarks</span>
                </div>
              </Link>

              {isAdmin && (
                <Link href="/admin" className={getLinkClass("/admin")}>
                  <div className="flex items-center space-x-3">
                    <UserRound color={getIconColor("/admin")} size={30} />
                    <span>Admin Dashboard</span>
                  </div>
                </Link>
              )}

              {isModerator && (
                <Link href="/moderator" className={getLinkClass("/moderator")}>
                  <div className="flex items-center space-x-3">
                    <UserRound color={getIconColor("/moderator")} size={30} />
                    <span>Moderator Dashboard</span>
                  </div>
                </Link>
              )}

              <button
                onClick={() => setIsModalOpen(true)}
                data-testid="create-post-button"
                className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white font-bold px-4 py-2 w-40 rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 focus:ring-2 focus:ring-orange-300 transition-all"
              >
                Post
              </button>
            </div>
          </nav>

          {/* Profil és logout rész módosítva */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-between space-x-3 w-[60%] max-w-lg border border-gray-600 rounded-full shadow-lg">
            <Link
              href="/profile"
              className="flex items-center justify-start text-white text-base p-2 hover:bg-orange-650 rounded-full transition-all w-full"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={user.profileImage || "/yeti_pfp.jpg"}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl ml-3">{user.username}</span>
            </Link>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center p-3 text-white text-base hover:bg-red-600 rounded-full"
            >
              <LogOut color="#FFFFFF" size={24} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}

      {/* Mobil overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
