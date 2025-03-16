"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Post from "../postSablon/post";

interface PostType {
  id: number;
  user: {
    username: string;
    profileImage?: string;
  };
  content: string;
  imageURL?: string;
  createdAt: string;
  likes: { userId: number; username: string }[];
  bookmarks: { userId: number; username: string }[];
}

export default function ProfilePosts() {
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserPosts(data);
        }
      } catch (error) {
        console.error('Hiba történt a posztok betöltésekor:', error);
      }
    };

    fetchUserPosts();
  }, [router]);

  function handlePostDelete(postId: number): void {
    setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  }

  return (
    <div>
      {userPosts.map((post) => (
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
            onDelete={handlePostDelete}
            showActions={true}
          />
          <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
