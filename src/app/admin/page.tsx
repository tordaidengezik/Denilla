"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<{ id: number; username: string; email: string }[]>([]);
  const [posts, setPosts] = useState<{ id: number; content: string }[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "user" | "post"; id: number } | null>(null);

  // Admin check és adatlekérdezés változatlan
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/admin/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAdmin(response.ok);
        if (!response.ok) router.push("/login");
      } catch {
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [usersRes, postsRes] = await Promise.all([
          fetch("/api/auth/admin/manageUsers", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/auth/admin/deletePosts", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (postsRes.ok) setPosts(await postsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const endpoint = deleteTarget.type === "user" 
        ? "/api/auth/admin/manageUsers" 
        : "/api/auth/admin/deletePosts";
      
      await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(deleteTarget.type === "user" ? { userId: deleteTarget.id } : { postId: deleteTarget.id }),
      });

      if (deleteTarget.type === "user") {
        setUsers(users.filter(user => user.id !== deleteTarget.id));
      } else {
        setPosts(posts.filter(post => post.id !== deleteTarget.id));
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-600 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Are you sure to delete?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2 rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all w-full sm:w-36"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700 transition-all w-full sm:w-36"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SideMenu/>
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-3xl font-bold mt-10">Admin Panel</h1>

        {/* Felhasználók kezelése */}
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Manage Users</h2>
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2">
              <span className="text-white">{user.username} ({user.email})</span>
              <button
                onClick={() => setDeleteTarget({ type: "user", id: user.id })}
                className="px-4 py-1 rounded-lg font-bold text-white transition-all bg-orange-650 hover:bg-orange-700"
              >
                Delete User
              </button>
            </div>
          ))}
        </section>

        {/* Posztok kezelése */}
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Manage Posts</h2>
          {posts.map((post) => (
            <div key={post.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2">
              <span className="text-white mr-4 break-words flex-1">{post.content}</span>
              <button
                onClick={() => setDeleteTarget({ type: "post", id: post.id })}
                className="px-4 py-1 rounded-lg font-bold text-white transition-all bg-orange-650 hover:bg-orange-700"
              >
                Delete Post
              </button>
            </div>
          ))}
        </section>
      </main>
      <RightSideMenu />
    </div>
  );
}
