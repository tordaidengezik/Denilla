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
  };
  likes: { userId: number; username: string }[];
  bookmarks: { userId: number; username: string }[];
}

export default function Following() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/posts/following", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching following posts:", error);
      }
    };

    fetchFollowingPosts();
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <TopMenu />
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-lg font-semibold">
              No posts from followed users yet
            </p>
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
