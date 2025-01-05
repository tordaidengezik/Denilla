"use client";

import { useEffect, useState } from "react";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";

interface BookmarkedPost {
  id: number;
  author: string;
  date: string;
  content: string;
  imageSrc?: string;
  initialLikes: number;
  initialBookmarks: number;
}

export default function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);

  // Könyvjelzők frissítése amikor változás történik
  const updateBookmarks = () => {
    const savedBookmarks = localStorage.getItem('bookmarkedPosts');
    if (savedBookmarks) {
      setBookmarkedPosts(JSON.parse(savedBookmarks));
    } else {
      setBookmarkedPosts([]);
    }
  };

  // Kezdeti betöltés
  useEffect(() => {
    updateBookmarks();
  }, []);

  // Könyvjelzők változásának figyelése
  useEffect(() => {
    window.addEventListener('storage', updateBookmarks);
    // Custom event figyelése a közvetlen változásokhoz
    window.addEventListener('bookmarkUpdate', updateBookmarks);
    
    return () => {
      window.removeEventListener('storage', updateBookmarks);
      window.removeEventListener('bookmarkUpdate', updateBookmarks);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        {bookmarkedPosts.map((post) => (
          <div key={post.id}>
            <Post
              id={post.id}
              author={post.author}
              date={post.date}
              content={post.content}
              imageSrc={post.imageSrc}
              initialLikes={post.initialLikes}
              initialBookmarks={post.initialBookmarks}
              onBookmarkRemove={updateBookmarks}
            />
            <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
          </div>
        ))}
      </main>
      <RightSideMenu />
    </div>
  );
}
