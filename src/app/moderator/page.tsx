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

interface UserEditModalProps {
  user: User;
  onCancel: () => void;
  onSave: (newUsername: string) => void;
}

interface PostEditModalProps {
  post: Post;
  onCancel: () => void;
  onSave: (newContent: string, imageURL: string) => void;
}

function UserEditModal({ user, onCancel, onSave }: UserEditModalProps): JSX.Element {
  const [username, setUsername] = useState<string>(user.username);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-black p-6 rounded-lg border border-gray-600 w-full max-w-md mx-4">
        <h3 className="text-white text-xl font-bold mb-4 text-center">Edit Username</h3>
        <input
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded focus:ring-2 focus:ring-orange-650 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-gray-700 hover:bg-gray-600 text-sm sm:text-base flex-1 sm:flex-none"
          >
            Cancel
          </button> 
          <button
            onClick={() => onSave(username)}
            className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base flex-1 sm:flex-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function PostEditModal({ post, onCancel, onSave }: PostEditModalProps): JSX.Element {
  const [content, setContent] = useState<string>(post.content);
  const [imageURL, setImageURL] = useState<string>(post.imageURL || "");

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-black p-6 rounded-lg border border-gray-600 w-full max-w-xl mx-4">
        <h3 className="text-white text-xl font-bold mb-4 text-center">Edit Post</h3>
        
        {imageURL && (
          <div className="mb-4">
            <Image 
              src={imageURL} 
              width={500} 
              height={300} 
              alt="Post image" 
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        )}
        
        <textarea
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg h-32 resize-none focus:ring-2 focus:ring-orange-650 focus:outline-none"
          placeholder="Edit post content..."
        />
        
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-gray-700 hover:bg-gray-600 text-sm sm:text-base flex-1 sm:flex-none"
          >
            Cancel
          </button>
          
          {imageURL && (
            <button
              onClick={() => setImageURL("")}
              className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-orange-650 hover:bg-orange-700 text-sm sm:text-base flex-1 sm:flex-none"
            >
              Delete Image
            </button>
          )}
          
          <button
            onClick={() => onSave(content, imageURL)}
            className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base flex-1 sm:flex-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModeratorPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
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

  const handleUserSave = async (userId: number, newUsername: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const targetUser = users.find(user => user.id === userId);
      if (targetUser?.role === "admin") {
        console.error("Admin felhasználók szerkesztése nem engedélyezett");
        setEditingUserId(null);
        return;
      }
  
      await fetch("/api/auth/moderator/editUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          newUsername: newUsername,
        }),
      });
  
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, username: newUsername }
            : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error("Error editing username:", error);
    }
  };
  
  const handlePostSave = async (postId: number, newContent: string, imageURL: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch("/api/auth/moderator/editPost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: postId,
          newContent: newContent,
          imageURL: imageURL
        }),
      });
  
      if (response.ok) {
        setEditingPostId(null);
        window.location.reload();
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };
  
  const userToEdit = users.find(user => user.id === editingUserId);
  const postToEdit = posts.find(post => post.id === editingPostId);

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
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={user.profileImage || "/yeti_pfp.jpg"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
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
                  onClick={() => setEditingUserId(user.id)}
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
                    onClick={() => setEditingPostId(post.id)}
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
  
        {userToEdit && (
          <UserEditModal 
            user={userToEdit}
            onCancel={() => setEditingUserId(null)}
            onSave={(newUsername: string) => handleUserSave(userToEdit.id, newUsername)}
          />
        )}
        
        {postToEdit && (
          <PostEditModal 
            post={postToEdit}
            onCancel={() => setEditingPostId(null)}
            onSave={(newContent: string, imageURL: string) => handlePostSave(postToEdit.id, newContent, imageURL)}
          />
        )}
      </main>
      <RightSideMenu />
    </div>
  );  
}
