"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  isFollowing: boolean;
  profileImage: string;
}

export default function RightSideMenu() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [followingState, setFollowingState] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          // Initialize following state from fetched data
          const initialFollowingState = data.reduce(
            (acc: Record<number, boolean>, user: User) => {
              acc[user.id] = user.isFollowing;
              return acc;
            },
            {}
          );
          setFollowingState(initialFollowingState);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/follow", {
        method: followingState[userId] ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (response.ok) {
        setFollowingState((prev) => ({
          ...prev,
          [userId]: !prev[userId],
        }));

        if (window.location.pathname === "/following") {
          window.dispatchEvent(new Event("followStatusChanged"));
        }
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <nav className="w-full md:w-1/4 h-1/4 md:h-full p-4 overflow-auto bg-dark-gray">
      {/* Who to Follow szekció */}
      <div className="border border-gray-500 rounded-lg p-4 bg-black mb-6">
        <h2 className="text-white font-bold mb-4">Who to Follow</h2>
        <ul className="space-y-1">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-900 transition"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={user.profileImage || "/yeti_pfp.jpg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-white">{user.username}</p>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-1 rounded-lg font-bold text-white transition-all ${
                  followingState[user.id]
                    ? "bg-orange-700 hover:bg-orange-800"
                    : "bg-orange-500 hover:bg-orange-700"
                }`}
              >
                {followingState[user.id] ? "Following" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Trends Today szekció */}
      <div className="border border-gray-500 rounded-lg p-4 bg-black">
        <h2 className="text-white font-bold mb-4">Top Trends Today</h2>
        <ul className="space-y-2">
          <li>
            <p className="text-gray-500 opacity-70">1 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #NextJs
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">2 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #React
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">3 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #JavaScript
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">4 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)}
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #TailwindCSS
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">5 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)}
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
