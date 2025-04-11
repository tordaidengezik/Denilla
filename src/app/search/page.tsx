"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import { useEffect, useState } from "react";
import Image from "next/image";
import Post from "../postSablon/post";

// Új típusok
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
    id: number;
    username: string;
    profileImage?: string;
  };
  likes: { userId: number }[];
  bookmarks: { userId: number }[];
}

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchType, setSearchType] = useState<'all' | 'users' | 'posts'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!searchQuery) {
          setUsers([]);
          setPosts([]);
          return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        // Párhuzamos keresés a két végponton
        const promises = [];
        
        if (searchType === 'all' || searchType === 'users') {
          promises.push(
            fetch(`/api/users/search?q=${searchQuery}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.ok ? res.json() : [])
          );
        } else {
          promises.push(Promise.resolve([]));
        }
        
        if (searchType === 'all' || searchType === 'posts') {
          promises.push(
            fetch(`/api/posts/search?q=${searchQuery}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.ok ? res.json() : [])
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        const [usersData, postsData] = await Promise.all(promises);
        
        setUsers(searchType === 'posts' ? [] : usersData);
        setPosts(searchType === 'users' ? [] : postsData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debouncing a kereséshez (300ms késleltetés)
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  const handleFollowToggle = async (userId: number, isFollowing?: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userId }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isFollowing: !isFollowing } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
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

        {loading && (
          <div className="flex justify-center p-4">
            <p className="text-white">Loading...</p>
          </div>
        )}

        {!loading && searchQuery && (users.length === 0 && posts.length === 0) && (
          <div className="p-4 text-center text-white">
            No results found for "{searchQuery}"
          </div>
        )}

        {(searchType === 'all' || searchType === 'users') && users.length > 0 && (
          <section className="p-4">
            <h2 className="text-white text-xl font-bold mb-4">Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg mb-2">
                  <div className="flex items-center space-x-3" data-testid="search-result">
                    <Image
                      src={user.profileImage || "/yeti_pfp.jpg"}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <p className="text-white">{user.username}</p>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                    data-testid="follow-button"
                    className={`px-4 py-1 rounded-lg font-bold text-white ${
                      user.isFollowing ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-650 hover:bg-orange-700"
                    }`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {(searchType === 'all' || searchType === 'posts') && posts.length > 0 && (
          <section className="p-4">
            <h2 className="text-white text-xl font-bold mb-4">Posts</h2>
            <div className="space-y-4">
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
          </section>
        )}
        
        {!searchQuery && (
          <div className="px-6 pt-2 space-y-6">
            {/* Keresési tippek */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-bold mb-3">Search Tips</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-orange-650">•</span>
                  Search for usernames to find people
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-650">•</span>
                  Search for keywords to find posts
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-orange-650">•</span>
                  Use the tabs to filter your results
                </li>
              </ul>
            </div>
            
            {/* Javasolt keresések */}
            <div>
              <h3 className="text-white font-bold mb-3">Try searching for:</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSearchQuery("yeti")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition"
                >
                  yeti
                </button>
                <button 
                  onClick={() => setSearchQuery("szia")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition"
                >
                  szia
                </button>
                <button 
                  onClick={() => setSearchQuery("food")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition"
                >
                  food
                </button>
                <button 
                  onClick={() => setSearchQuery("photography")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition"
                >
                  photography
                </button>
                <button 
                  onClick={() => setSearchQuery("tech")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition"
                >
                  tech
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <RightSideMenu />
    </div>
  );
}
