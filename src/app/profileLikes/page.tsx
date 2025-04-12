"use client";

import { useEffect, useState } from "react";
import Post from "../postSablon/post";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LikedPost {
  id: number;
  user: {
    id: number;
    username: string;
    profileImage?: string;
  };
  post: {
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
  };
}

export default function ProfileLikes() {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedPostsByFollowing = async () => {
      try {
        setIsLoading(true);
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
          setLikedPosts(data);
        }
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedPostsByFollowing();
    const handleLikeUpdate = () => setRefreshKey((prev) => prev + 1);
    
    window.addEventListener("likeUpdate", handleLikeUpdate);
    window.addEventListener("followStatusChanged", fetchLikedPostsByFollowing);
    
    return () => {
      window.removeEventListener("likeUpdate", handleLikeUpdate);
      window.removeEventListener("followStatusChanged", fetchLikedPostsByFollowing);
    };

    
  }, [router, refreshKey]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">
      <div className="text-white text-lg">Betöltés...</div>
    </div>;
  }

  if (likedPosts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 p-4">
        <div className="text-white text-center text-xl font-semibold mb-2">
        its quiet
        </div>
        <div className="text-gray-400 text-center text-sm">
        The users you follow havent liked any posts yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      {likedPosts.map((item) => (
        <div key={`${item.post.id}-${item.user.id}`} className="mb-4">
          {/* "Liked by" információ */}
          <div className="flex items-center px-4 py-2 text-gray-400">
            <div className="flex-shrink-0 mr-2">
              <Image
                src={item.user.profileImage || "/yeti_pfp.jpg"}
                alt={item.user.username}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <span>
              liked by <span className="font-semibold text-white">{item.user.username}</span>
            </span>
          </div>
          
          {/* A poszt megjelenítése */}
          <Post
            data-testid="post-content"
            id={item.post.id}
            author={item.post.user.username}
            date={new Date(item.post.createdAt).toLocaleDateString()}
            content={item.post.content}
            imageSrc={item.post.imageURL}
            initialLikes={item.post.likes.length}
            initialBookmarks={item.post.bookmarks.length}
            profileImage={item.post.user.profileImage || "/yeti_pfp.jpg"}
            onLikeRemove={() => setRefreshKey((prev) => prev + 1)}
          />
          <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
        </div>
      ))}
    </div>
  );
}
