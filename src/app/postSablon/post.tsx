"use client";

import Image from "next/image";
import { Dot, Heart, Bookmark, Trash2, Pencil } from "lucide-react";
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
  onLikeRemove?: () => void;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number, content: string, file: File | null) => void;
  showActions?: boolean; 
}

export default function Post({
  id,
  author,
  date,
  content,
  imageSrc,
  initialLikes,
  initialBookmarks,
  onDelete,
  showActions = false,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [bookmarked, setBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedPosts');
    if (savedBookmarks) {
      const bookmarkedPosts = JSON.parse(savedBookmarks);
      setBookmarked(bookmarkedPosts.some((post: PostProps) => post.id === id));
    }

    const savedLikes = localStorage.getItem('likedPosts');
    if (savedLikes) {
      const likedPosts = JSON.parse(savedLikes);
      setLiked(likedPosts.some((post: PostProps) => post.id === id));
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
}

const handleEdit = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const formData = new FormData();
  formData.append('postId', id.toString());
  formData.append('content', editContent);
  if (editFile) {
    formData.append('file', editFile);
  }

  const response = await fetch('/api/posts', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if (response.ok) {
    setCurrentContent(editContent);
    if (editFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageSrc(reader.result as string);
      };
      reader.readAsDataURL(editFile);
    }
    setIsEditing(false);
  }
};


const handleDelete = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('/api/posts', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: id }),
    });

    if (response.ok) {
      onDelete?.(id);
      
      // Könyvjelzők frissítése
      const savedBookmarks = localStorage.getItem('bookmarkedPosts');
      if (savedBookmarks) {
        const bookmarkedPosts = JSON.parse(savedBookmarks);
        const updatedBookmarks = bookmarkedPosts.filter((post: PostProps) => post.id !== id);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
        window.dispatchEvent(new Event('bookmarkUpdate'));
      }
    }
  } catch (error) {
    console.error('Hiba történt a törlés során:', error);
  }
};

const handleLike = () => {
  const savedLikes = localStorage.getItem('likedPosts');
  let likedPosts = savedLikes ? JSON.parse(savedLikes) : [];
  
  if (!liked) {
    // Like hozzáadása
    likedPosts.push({
      id,
      author,
      date,
      content,
      imageSrc,
      initialLikes: likes,
      initialBookmarks
    });
    setLikes(likes + 1);
  } else {
    // Like eltávolítása
    likedPosts = likedPosts.filter((post: PostProps) => post.id !== id);
    setLikes(likes - 1);
  }
  
  localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  setLiked(!liked);
  window.dispatchEvent(new Event('likeUpdate'));
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
          onClick={handleLike}
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
      <p className="mb-4">{currentContent}</p>
      {currentImageSrc && (
        <div className="overflow-hidden rounded-xl max-h-96 mt-4">
          <Image
            src={currentImageSrc}
            alt="Post Image"
            width={5000}
            height={5000}
            className="w-full object-cover"
          />
        </div>
      )}
    </div>

    {showActions && !isEditing && (
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-orange-650 text-white px-3 py-2 w-32 rounded-xl hover:bg-orange-500 transition-all flex items-center justify-center space-x-2"
        >
          <span>Edit</span>      
          <Pencil size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="bg-gray-500 text-white px-3 py-2 w-32 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
        >
          <span>Delete</span> 
          <Trash2 size={16}/>      
        </button>
      </div>
    )}

    {showActions && isEditing && (
      <div className="mt-4">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded focus:ring-orange-650"
        />
        <input
          type="file"
          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-3 py-2 w-32 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
            >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="bg-orange-650 text-white px-3 py-2 w-32 rounded-xl hover:bg-orange-500 transition-all flex items-center justify-center space-x-2"
            >
            Save
          </button>
        </div>
      </div>
    )}
  </div>
)};
