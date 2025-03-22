"use client";

import { useEffect, useState } from "react";
import SideMenu from "../sidemenu/page";

export default function ModeratorPage() {
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [posts, setPosts] = useState<{ id: number; content: string }[]>([]);
  const [editUser, setEditUser] = useState<{
    id: number | null;
    username: string;
  }>({ id: null, username: "" });
  const [editPost, setEditPost] = useState<{
    id: number | null;
    content: string;
  }>({ id: null, content: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [usersRes, postsRes] = await Promise.all([
          fetch("/api/auth/moderator/editUser", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/auth/moderator/editPost", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (usersRes.ok) setUsers(await usersRes.json());
        if (postsRes.ok) setPosts(await postsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Felhasználónév szerkesztése
  const handleUserEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !editUser.id) return;

      await fetch("/api/auth/moderator/editUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: editUser.id,
          newUsername: editUser.username,
        }),
      });

      setUsers(
        users.map((user) =>
          user.id === editUser.id
            ? { ...user, username: editUser.username }
            : user
        )
      );
      setEditUser({ id: null, username: "" });
    } catch (error) {
      console.error("Error editing username:", error);
    }
  };

  // Poszt szövegének szerkesztése
  const handlePostEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !editPost.id) return;

      await fetch("/api/auth/moderator/editPost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: editPost.id,
          newContent: editPost.content,
        }),
      });

      setPosts(
        posts.map((post) =>
          post.id === editPost.id
            ? { ...post, content: editPost.content }
            : post
        )
      );
      setEditPost({ id: null, content: "" });
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-3/4 h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-3xl font-bold mt-10">
          Moderator Dashboard
        </h1>

        {/* Felhasználók szerkesztése */}
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Manage Users
          </h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2"
            >
              <span className="text-white">{user.username}</span>
              <button
                onClick={() =>
                  setEditUser({ id: user.id, username: user.username })
                }
                className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </section>

        {/* Posztok szerkesztése */}
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Manage Post
          </h2>
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-2"
            >
              <p className="text-white">{post.content}</p>
              <button
                onClick={() =>
                  setEditPost({ id: post.id, content: post.content })
                }
                className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </section>

        {/* Szerkesztési modalok */}
        {editUser.id && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-96">
              <input
                type="text"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditUser({ id: null, username: "" })}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUserEdit}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {editPost.id && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-96">
              <textarea
                value={editPost.content}
                onChange={(e) =>
                  setEditPost({ ...editPost, content: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded h-32"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditPost({ id: null, content: "" })}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostEdit}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
