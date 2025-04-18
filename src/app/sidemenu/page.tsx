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
  Menu,
  UserRound,
} from "lucide-react";
import CreatePostModal from "../createPost/createPost";
import ReactDOM from "react-dom";

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

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const renderLogoutConfirmModal = () => {
    if (!showLogoutConfirm) return null;
    
    if (typeof document === 'undefined') return null;
    
    return ReactDOM.createPortal(
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowLogoutConfirm(false);
        }}
      >
        <div 
          className="p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl transition-all duration-300 shadow-md hover:shadow-xl border border-gray-800 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white text-xl font-bold mb-6 text-center">
            Are you sure to logout?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutConfirm(false);
              }}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Yes</span>
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      {renderLogoutConfirmModal()}      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-5 left-5 z-50 p-2.5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full shadow-lg border border-gray-700 hover:from-orange-650 hover:to-orange-700 transition-all duration-300"
          aria-label="Menü nyitása"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

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

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] lg:w-[85%] max-w-[280px] bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-full shadow-lg overflow-hidden">
            <div className="flex items-center justify-between">
              <Link
                href="/profile"
                className="flex items-center flex-grow py-2 pl-2 pr-1 hover:bg-gray-800/50 transition-all duration-300 rounded-l-full group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-650 transition-all duration-300">
                  <Image
                    src={user.profileImage || "/yeti_pfp.jpg"}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <span className="font-semibold text-base ml-2 text-gray-100 group-hover:text-white truncate max-w-[130px] transition-all">
                  {user.username}
                </span>
              </Link>

              <div className="h-8 w-px bg-gray-700 mx-1"></div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogoutConfirm(true);
                }}
                className="p-2.5 text-gray-300 hover:text-white hover:bg-red-600/80 rounded-full transition-all duration-300 flex items-center justify-center ml-1"
                aria-label="Kijelentkezés"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
