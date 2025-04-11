"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";

interface User {
  id: number;
  username: string;
  email?: string;
  profileImage?: string;
  role?: string;
}

interface Post {
  id: number;
  content: string;
  imageURL?: string;
  createdAt: string;
  user: {
    username: string;
    profileImage?: string;
  };
  likes?: { userId: number }[];
  bookmarks?: { userId: number }[];
}

export default function ModeratorPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editUser, setEditUser] = useState<{
    id: number | null;
    username: string;
  }>({ id: null, username: "" });
  const [editPost, setEditPost] = useState<{
    id: number | null;
    content: string;
    imageURL?: string;
  }>({ id: null, content: "", imageURL: "" });

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

        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData);
        }
        
        if (postsRes.ok) {
          const postData = await postsRes.json();
          // Normalizálás a hiányzó mezők miatt
          setPosts(postData.map((post: Partial<Post>) => ({
            ...post,
            likes: post.likes || [],
            bookmarks: post.bookmarks || [],
            user: post.user || { username: "Unknown", profileImage: null }
          })));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUserEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !editUser.id) return;
      
      const targetUser = users.find(user => user.id === editUser.id);
      if (targetUser?.role === "admin") {
        console.error("Admin felhasználók szerkesztése nem engedélyezett");
        setEditUser({ id: null, username: "" });
        return;
      }
  
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
          imageURL: editPost.imageURL
        }),
      });

      setPosts(
        posts.map((post) =>
          post.id === editPost.id
            ? { ...post, content: editPost.content, imageURL: editPost.imageURL }
            : post
        )
      );
      setEditPost({ id: null, content: "", imageURL: "" });
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
  
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-3xl font-bold mt-10">
          Moderator Dashboard
        </h1>
  
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Manage Users
          </h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg mb-2"
            >
              <div className="flex items-center mb-3 sm:mb-0">
                <Image 
                  src={user.profileImage || "/yeti_pfp.jpg"} 
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-semibold">{user.username}</div>
                  {user.email && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <span>{user.email}</span>
                      {user.role && (
                        <>
                          <span className="mx-2">•</span>
                          <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                            user.role === "admin" 
                              ? "bg-red-900/30 text-red-400" 
                              : user.role === "moderator" 
                                ? "bg-green-900/30 text-green-400"
                                : "bg-blue-900/30 text-blue-400"
                          }`}>
                            {user.role}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {user.role !== "admin" ? (
                <button
                  onClick={() => setEditUser({ id: user.id, username: user.username })}
                  className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  Edit
                </button>
              ) : (
                <div className="px-3 py-1 rounded-lg font-bold text-green-600 bg-green-900/20 border border-green-700 text-sm sm:text-base">
                  Protected Admin Account
                </div>
              )}
            </div>
          ))}

        </section>
  
        <section className="p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Manage Posts
          </h2>
          {posts.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-white">
              <p className="text-lg font-semibold">No posts found</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="mb-6 relative">
                <Post
                  id={post.id}
                  author={post.user?.username || "Unknown"}
                  date={new Date(post.createdAt).toLocaleDateString()}
                  content={post.content}
                  imageSrc={post.imageURL}
                  initialLikes={post.likes?.length || 0}
                  initialBookmarks={post.bookmarks?.length || 0}
                  profileImage={post.user?.profileImage || "/yeti_pfp.jpg"}
                  hideInteractions={true}
                />
                
                <div className="absolute top-4 right-4 flex z-10">
                  <button
                    onClick={() => setEditPost({ 
                      id: post.id, 
                      content: post.content,
                      imageURL: post.imageURL
                    })}
                    className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                </div>
                
                <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
              </div>
            ))
          )}
        </section>
  
        {editUser.id && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-black p-6 rounded-lg border border-gray-600 w-full max-w-md mx-4">
              <h3 className="text-white text-xl font-bold mb-4 text-center">Edit Username</h3>
              <input
                type="text"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                className="w-full p-2 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-orange-650 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditUser({ id: null, username: "" })}
                  className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-gray-700 hover:bg-gray-600 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  Cancel
                </button> 
                <button
                  onClick={handleUserEdit}
                  className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        
        {editPost.id && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-black p-6 rounded-lg border border-gray-600 w-full max-w-xl mx-4">
              <h3 className="text-white text-xl font-bold mb-4 text-center">Edit Post</h3>
              
              {editPost.imageURL && (
                <div className="mb-4">
                  <Image 
                    src={editPost.imageURL} 
                    width={500} 
                    height={300} 
                    alt="Post image" 
                    className="rounded-lg w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <textarea
                value={editPost.content}
                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg h-32 resize-none focus:ring-2 focus:ring-orange-650 focus:outline-none"
                placeholder="Edit post content..."
              />
              
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setEditPost({ id: null, content: "", imageURL: "" })}
                  className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-gray-700 hover:bg-gray-600 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  Cancel
                </button>
                
                {editPost.imageURL && (
                  <button
                    onClick={() => setEditPost({...editPost, imageURL: ""})}
                    className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-orange-650 hover:bg-orange-700 text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    Delete Image
                  </button>
                )}
                
                <button
                  onClick={handlePostEdit}
                  className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <RightSideMenu />
    </div>
  );  
}
