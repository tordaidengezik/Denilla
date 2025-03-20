"use client";

import { useSearchParams, useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Post from "../postSablon/post";

export default function Layout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("id"); // Az URL-ből kiolvassuk az ID-t

  interface Comment {
    id: string;
    content: string;
    user: {
      username: string;
      profileImage?: string;
    };
  }

  interface Post {
    id: number;
    user: {
      username: string;
      profileImage: string;
    };
    date: string;
    content: string;
    createdAt: string;
    imageURL?: string;
    likes: { userId: number; username: string }[];
    bookmarks: { userId: number; username: string }[];
  }

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Poszt lekérése
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  // Kommentek lekérése
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // Új komment hozzáadása
  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content: newComment }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment(""); // Input mező törlése
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!post) {
    return (
      <div className="text-center text-white">
        <h1>Post not found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        {/* Vissza gomb */}
        <div className="p-4 flex items-center space-x-2">
          <button
            onClick={() => router.back()}
            className="text-white px-4 py-2 rounded-lg hover:bg-orange-650 transition-all"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-white font-bold text-lg">Post</h2>
        </div>

        {/* Poszt megjelenítése */}
        <div key={post.id}>
          <Post
            id={post.id}
            author={post.user.username}
            date={new Date(post.createdAt).toLocaleDateString()}
            content={post.content}
            imageSrc={post.imageURL}
            initialLikes={post.likes.length}
            initialBookmarks={post.bookmarks.length}
            profileImage={post.user.profileImage || "/yeti_pfp.jpg"}
          />
          <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
        </div>

        {/* Kommentek */}
        <div className="p-4 space-y-4">
          <h2 className="text-white font-bold text-lg mb-3">Comments</h2>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-center space-x-4 bg-black p-4 rounded-lg border border-gray-600"
            >
              {/* Felhasználói kép */}
              <Image
                src={comment.user.profileImage || "/default-avatar.jpg"}
                alt={comment.user.username}
                width={50}
                height={50}
                className="rounded-full"
              />

              {/* Szöveg (név és üzenet egymás mellett) */}
              <div className="flex flex-col">
                <p className="text-white font-bold">{comment.user.username}</p>
                <p className="text-gray-400">{comment.content}</p>
              </div>
            </div>
          ))}

          {/* Új komment írása */}
          <div className="flex items-center space-x-4 mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow p-2 rounded bg-gray-800 text-white"
            />
            <button
              onClick={handleAddComment}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-all"
            >
              Add Comment
            </button>
          </div>
        </div>
      </main>

      <RightSideMenu />
    </div>
  );
}
