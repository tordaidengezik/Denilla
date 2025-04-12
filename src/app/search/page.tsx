"use client";

import { useState, useEffect, useCallback } from "react";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";
import Post from "../postSablon/post";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  profileImage?: string;
  isFollowing?: boolean;
}

interface PostType {
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

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'all' | 'users' | 'posts'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-ből a keresési paraméter kiolvasása
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  // Keresés végrehajtása
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        setPosts([]);
        return;
      }

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        let endpoint = `/api/search?q=${encodeURIComponent(searchQuery)}`;
        
        if (searchType !== 'all') {
          endpoint += `&type=${searchType}`;
        }

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (searchType === 'users' || searchType === 'all') {
            setUsers(data.users || []);
          } else {
            setUsers([]);
          }

          if (searchType === 'posts' || searchType === 'all') {
            setPosts(data.posts || []);
          } else {
            setPosts([]);
          }
        }
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType, router]);

  // Follow/Unfollow kezelése
  const handleFollowToggle = async (userId: number, isFollowing?: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: !isFollowing }
            : user
        )
      );

      window.dispatchEvent(new Event("followStatusChanged"));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {/* Kereső mező */}
        <div className="p-4">
          <input
            type="text"
            data-testid="search-input"
            placeholder="Search for posts or profiles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-650"
          />
          
          <div className="flex justify-between mt-3 w-full px-4 sm:px-8 md:px-12 lg:px-20">
            <button
              onClick={() => setSearchType('all')}
              className={`font-bold transition-all text-base sm:text-lg pb-2 ${
                searchType === 'all' 
                  ? 'text-orange-650' 
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchType('users')}
              className={`font-bold transition-all text-base sm:text-lg pb-2 ${
                searchType === 'users' 
                  ? 'text-orange-650' 
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setSearchType('posts')}
              className={`font-bold transition-all text-base sm:text-lg pb-2 ${
                searchType === 'posts' 
                  ? 'text-orange-650' 
                  : 'text-gray-300 hover:text-gray-100'
              }`}
            >
              Posts
            </button>
          </div>
        </div>
        
        {/* Betöltési állapot */}
        {loading ? (
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-650"></div>
          </div>
        ) : (
          <div>
            {/* Felhasználók listája */}
            {(searchType === 'all' || searchType === 'users') && users.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-lg font-semibold px-4 mb-2">Users</h2>
                <ul>
                  {users.map((user) => (
                    <li 
                      key={user.id} 
                      className="px-4 py-3 hover:bg-gray-900 flex items-center justify-between"
                    >
                      <Link 
                        href={`/profile/${user.username}`} 
                        className="flex items-center space-x-3"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={user.profileImage || "/yeti_pfp.jpg"}
                            alt={user.username}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white">{user.username}</span>
                      </Link>
                      <button
                        onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                        className={`px-4 py-1 rounded-lg font-bold text-white ${
                          user.isFollowing 
                            ? "bg-orange-700 hover:bg-orange-800" 
                            : "bg-orange-650 hover:bg-orange-700"
                        }`}
                      >
                        {user.isFollowing ? "Following" : "Follow"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Posztok listája */}
            {(searchType === 'all' || searchType === 'posts') && posts.length > 0 && (
              <div>
                {searchType === 'all' && <h2 className="text-white text-lg font-semibold px-4 mb-2">Posts</h2>}
                {posts.map((post) => (
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
                ))}
              </div>
            )}
            
            {/* Ha nincs találat */}
            {searchQuery && !loading && users.length === 0 && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="text-gray-400 text-xl mb-2">No results found</div>
                <div className="text-gray-500">Try different keywords or filters</div>
              </div>
            )}
            
            {/* Ha üres a keresés */}
            {!searchQuery && (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="text-gray-400 text-xl mb-2">Search for posts and users</div>
                <div className="text-gray-500">Type something to start searching</div>
              </div>
            )}
          </div>
        )}
      </main>
      <RightSideMenu />
    </div>
  );
}
