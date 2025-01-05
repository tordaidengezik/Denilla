"use client";

import Image from "next/image";
import { Dot, Heart, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";


interface PostProps {
  id: number;
  author: string;
  date: string;
  content: string;
  imageSrc?: string;
  initialLikes: number;
  initialBookmarks: number;
  onBookmarkRemove?: () => void;
}

export default function Post({
  id,
  author,
  date,
  content,
  imageSrc,
  initialLikes,
  initialBookmarks,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [bookmarked, setBookmarked] = useState(false);


  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedPosts');
    if (savedBookmarks) {
      const bookmarkedPosts = JSON.parse(savedBookmarks);
      setBookmarked(bookmarkedPosts.some((post: PostProps) => post.id === id));
    }
  }, [id]);

  const handleBookmark = () => {
    const savedBookmarks = localStorage.getItem('bookmarkedPosts');
    let bookmarkedPosts = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    if (!bookmarked) {
      // Poszt hozzáadása a bookmarkokhoz
      bookmarkedPosts.push({
        id,
        author,
        date,
        content,
        imageSrc,
        initialLikes,
        initialBookmarks
      });
      setBookmarks(bookmarks + 1);
    } else {
      bookmarkedPosts = bookmarkedPosts.filter((post: PostProps) => post.id !== id);
    }

    localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
  setBookmarked(!bookmarked);
  window.dispatchEvent(new Event('bookmarkUpdate'));
};


  
  return (
    <div className="p-6 bg-black rounded-xl mx-3 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/yeti_pfp.jpg"
            alt={author}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="font-bold text-white">{author}</h1>
          <h1 className="flex text-gray-400">
            <Dot />
            {date}
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes(liked ? likes - 1 : likes + 1);
            }}
            className="flex items-center space-x-2"
          >
            <p className={liked ? "text-red-600" : "text-white"}>{likes}</p>
            <Heart className={liked ? "text-red-600" : "text-white"} />
          </button>
          <button
            onClick={handleBookmark} 
            className="flex items-center space-x-2"
          >
            <p className={bookmarked ? "text-blue-500" : "text-white"}>{bookmarks}</p>
            <Bookmark className={bookmarked ? "text-blue-500" : "text-white"} />
          </button>
        </div>
      </div>
      <div className="pt-5">
        {/* Szöveg */}
        <p className="mb-4">{content}</p> {/* Alsó margót adunk a szövegnek */}
        
        {/* Kép */}
        {imageSrc && (
          <div className="overflow-hidden rounded-xl max-h-96 mt-4"> {/* Felső margót adunk a képnek */}
            <Image
              src={imageSrc}
              alt="Post Image"
              width={5000}
              height={5000}
              className="w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
