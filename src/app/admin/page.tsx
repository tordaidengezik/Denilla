"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/admin/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAdmin(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-3xl font-bold mt-10">Admin Panel</h1>
        <div className="p-4">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all">
            Delete User Posts
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all ml-4">
            Manage Users
          </button>
        </div>
      </main>
    </div>
  );
}
