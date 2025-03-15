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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Felhasználók lekérése
        const usersResponse = await fetch("/api/auth/admin/manageUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Posztok lekérése
        const postsResponse = await fetch("/api/auth/admin/deletePosts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/auth/admin/manageUsers", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/auth/admin/deletePosts", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-3xl font-bold mt-10">Admin Panel</h1>

        {/* Felhasználók kezelése */}
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">Manage Users</h2>
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2">
              <span className="text-white">{user.username} ({user.email})</span>
              <button
                onClick={() => handleDeleteUser(user.id)}
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
                onClick={() => handleDeletePost(post.id)}
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
