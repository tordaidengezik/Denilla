"use client";

import { useEffect, useState } from "react";
import Post from "../postSablon/post";

interface LikedPost {
  id: number;
  author: string;
  date: string;
  content: string;
  imageSrc?: string;
  initialLikes: number;
  initialBookmarks: number;
}

export default function ProfileLikes() {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);

// Like-ok frissítése amikor változás történik
const updateLikes = () => {
  const savedLikes = localStorage.getItem('likedPosts');
  if (savedLikes) {
    setLikedPosts(JSON.parse(savedLikes));
  } else {
    setLikedPosts([]);
  }
};

// Kezdeti betöltés
useEffect(() => {
  updateLikes();
}, []);

// Like-ok változásának figyelése
useEffect(() => {
  window.addEventListener('storage', updateLikes);
  // Custom event figyelése a közvetlen változásokhoz
  window.addEventListener('likeUpdate', updateLikes);
  
  return () => {
    window.removeEventListener('storage', updateLikes);
    window.removeEventListener('likeUpdate', updateLikes);
  };
}, []);

return (
  <div>
    {likedPosts.map((post, index) => (
      <div key={`${post.id}-${index}`}>
        <Post
          id={post.id}
          author={post.author}
          date={post.date}
          content={post.content}
          imageSrc={post.imageSrc}
          initialLikes={post.initialLikes}
          initialBookmarks={post.initialBookmarks}
          onLikeRemove = {updateLikes}
        />
        <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
      </div>
    ))}
  </div>
);
}