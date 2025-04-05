"use client";

import { useEffect, useState } from "react";
import Post from "../postSablon/post";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  content: string;
  imageURL?: string;
  createdAt: string;
  user: {
    username: string;
    profileImage?: string;
  };
  likes: { userId: number }[];
  bookmarks: { userId: number }[];
}

export default function ProfileLikes() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/like", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.map((l: { post: Post }) => l.post));
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
    const handleLikeUpdate = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener("likeUpdate", handleLikeUpdate);

    return () => {
      window.removeEventListener("likeUpdate", handleLikeUpdate);
    };
  }, [router, refreshKey]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            data-testid="post-content"
            id={post.id}
            author={post.user.username}
            date={new Date(post.createdAt).toLocaleDateString()}
            content={post.content}
            imageSrc={post.imageURL}
            initialLikes={post.likes.length}
            initialBookmarks={post.bookmarks.length}
            profileImage={post.user.profileImage || "/yeti_pfp.jpg"}
            onLikeRemove={()=> setRefreshKey((prev) => prev + 1)}
          />
          <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
