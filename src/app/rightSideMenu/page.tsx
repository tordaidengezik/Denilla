"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  isFollowing?: boolean;
  profileImage?: string;
}

export default function RightSideMenu() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFollowToggle = async (userId: number, isFollowing?: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );

      window.dispatchEvent(new Event("followStatusChanged"));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <nav className="w-full md:w-1/4 h-full p-4 overflow-auto bg-dark-gray hidden min-[1300px]:block min-[1300px]:w-1/4">
      <div className="border border-gray-500 rounded-lg p-4 bg-black mb-6">
        <h2 className="text-white font-bold mb-4">Who to Follow</h2>
        <ul className="space-y-1">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-900 transition">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user.profileImage || "/yeti_pfp.jpg"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white">{user.username}</p>
              </div>
              <button
                onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                data-testid="follow-button"
                className={`px-4 py-1 rounded-lg font-bold text-white ${
                  user.isFollowing ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-650 hover:bg-orange-700"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Módosított Top Trends Today szekció */}
      <div className="border border-gray-500 rounded-lg p-4 bg-black">
        <h2 className="text-white font-bold mb-4">Top Trends Today</h2>
        <ul className="space-y-2">
          <li>
            <p className="text-gray-500 opacity-70">1 - trending</p>
            <a
              onClick={() => router.push(`/search?q=NextJs`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #NextJs
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">2 - trending</p>
            <a
              onClick={() => router.push(`/search?q=React`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #React
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">3 - trending</p>
            <a
              onClick={() => router.push(`/search?q=JavaScript`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #JavaScript
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">4 - trending</p>
            <a
              onClick={() => router.push(`/search?q=TailwindCSS`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #TailwindCSS
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">5 - trending</p>
            <a
              onClick={() => router.push(`/search?q=WebDevelopment`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #WebDevelopment
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
