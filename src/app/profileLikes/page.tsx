"use client";

import { useEffect, useState } from "react";
import Post from "../postSablon/post";

interface PostType {
  id: number;
  user: {
    username: string;
  };
  content: string;
  imageURL?: string;
  createdAt: string;
  likes: { userId: number; username: string }[];
  bookmarks: { userId: number; username: string }[];
}

export default function ProfileLikes() {
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/like', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLikedPosts(data);
        }
      } catch (error) {
        console.error('Hiba történt a kedvelt posztok betöltésekor:', error);
      }
    };

    fetchLikedPosts();
  }, []);

  return (
    <div>
      {likedPosts.map((post) => (
        <div key={post.id}>
          <Post
            id={post.id}
            author={post.user.username}
            date={new Date(post.createdAt).toLocaleDateString()}
            content={post.content}
            imageSrc={post.imageURL}
            initialLikes={post.likes.length}
            initialBookmarks={post.bookmarks.length}
          />
          <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
