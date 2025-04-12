"use client";

import { useEffect, useState } from "react";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState(""); // Új állapot a kereséshez
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

  // Szűrjük a posztokat a keresési kifejezés alapján
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {/* Kereső mező - csak akkor jelenik meg, ha van elmentett poszt */}
        {posts.length > 0 && (
          <div className="sticky top-0 bg-dark-gray p-4 z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Posztok megjelenítése vagy üres üzenet */}
        {filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            {posts.length === 0 ? (
              <p className="text-lg font-semibold">You haven't bookmarked any post yet</p>
            ) : (
              <p className="text-lg font-semibold">No bookmarked posts match your search</p>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => (
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
