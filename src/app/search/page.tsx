"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [users, setUsers] = useState<{ id: number; username: string; profileImage?: string; isFollowing?: boolean }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!searchQuery) {
          setUsers([]);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`/api/users/search?q=${searchQuery}`, {
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
  }, [searchQuery]);

  const handleFollowToggle = async (userId: number, isFollowing?: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isFollowing: !isFollowing } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">

        {/* Keresőmező */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search for posts or profiles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-650"
          />
        </div>

        {/* Felhasználók listázása */}
        <section className="p-4 space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              {/* Profilkép és név */}
              <div className="flex items-center space-x-3">
                <Image
                  src={user.profileImage || "/yeti_pfp.jpg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <p className="text-white">{user.username}</p>
              </div>
              {/* Követési gomb */}
              <button
                onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                className={`px-4 py-1 rounded-lg font-bold text-white ${
                  user.isFollowing ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-650 hover:bg-orange-700"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </section>
      </main>

      <RightSideMenu />
    </div>
  );
}
