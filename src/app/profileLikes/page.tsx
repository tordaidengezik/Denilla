<<<<<<< HEAD
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
=======
import Profile from "../profileSablon/profile"

export default function ProfilePage() {
  const profileData = {
    name: "Yeti",
    description:
      "Enthusiast of statistics and data analysis. Sharing insights and exploring the world one dataset at a time.",
    coverImage: "/cover.jpg",
    profileImage: "/yeti_pfp.jpg",
    posts: [
      {
        id: 1,
        author: "Yeti",
        date: "2022 December 12",
        content:
          "If the image is rectangular, using rounded-full will turn it into an oval shape unless the width and height are equal.",
        imageSrc: "/death-stranding.jpg",
        initialLikes: 234,
        initialBookmarks: 56,
      },
      {
        id: 3,
        author: "Yeti",
        date: "2018 September 09",
        content:
          "Embark on a voyage of a lifetime with One Piece. The epic anime series created by renowned mangaka Eiichiro Oda is a global phenomenon.",
        imageSrc: "/luffy.jpg",
        initialLikes: 120,
        initialBookmarks: 30,
      },
    ],
  };

  return (
    <Profile
      name={profileData.name}
      description={profileData.description}
      coverImage={profileData.coverImage}
      profileImage={profileData.profileImage}
      posts={profileData.posts}
    />
>>>>>>> 6cd064934ab47c6fd25e6457d4744a100f2cc06c
  );
}
