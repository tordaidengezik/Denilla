"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import TopMenu from "../topmenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";

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

export default function ForYouPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <TopMenu />
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-lg font-semibold">Nincsenek posztok</p>
          </div>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </main>
      <RightSideMenu />
    </div>
  );
}
