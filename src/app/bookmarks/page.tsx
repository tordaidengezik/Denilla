"use client";

import { useEffect, useState } from "react";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
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
export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/bookmark", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.map((b: { post: Post }) => b.post));
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
    const handleBookmarkUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    }
    window.addEventListener("bookmarkUpdate", handleBookmarkUpdate);

    return () => {
      window.removeEventListener("bookmarkUpdate", handleBookmarkUpdate);
    };
  }, [router, refreshKey]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-lg font-semibold">You haven’t bookmarked any post yet</p>
          </div>
        ) : (
          posts.map((post) => (
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
