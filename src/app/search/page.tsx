"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import { useEffect, useState } from "react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [users, setUsers] = useState<{ id: number; username: string; email: string }[]>([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
  
          const [usersRes] = await Promise.all([
            fetch("/api/auth/admin/manageUsers", { headers: { Authorization: `Bearer ${token}` } })
          ]);
  
          if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">

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

        <section className="p-4">
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2">
              <span className="text-white">{user.username} ({user.email})</span>
            </div>
          ))}
        </section>
      </main>

      <RightSideMenu />
    </div>
  );
}