"use client";

import Image from "next/image";
import { Heart, Bookmark, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactDOM from "react-dom"; // Új import a Portal-hoz

interface PostProps {
  id: number;
  author: string;
  date: string;
  content: string;
  imageSrc?: string;
  initialLikes: number;
  initialBookmarks: number;
  profileImage?: string;
  onBookmarkRemove?: () => void;
  onLikeRemove?: () => void;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number, content: string, file: File | null) => void;
  showActions?: boolean;
  hideInteractions?: boolean;
  fullImage?: boolean; 
}

export default function Post({
  id,
  author,
  date,
  content,
  imageSrc,
  initialLikes,
  initialBookmarks,
  profileImage = "/yeti_pfp.jpg",
  onDelete,
  showActions = false,
  onLikeRemove,
  hideInteractions = false,
  fullImage = false, 
}: PostProps) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarks);
  const [bookmarked, setBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkUserInteractions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/user/interactions?postId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setBookmarked(data.bookmarked);
      }
    };

    checkUserInteractions();
  }, [id]);

  const handlePostClick = () => {
    // Ha a törlési megerősítő látható, ne navigálj
    if (showDeleteConfirm) return;
    router.push(`/postView?id=${id}`);
  };

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const method = bookmarked ? "DELETE" : "POST";
      const response = await fetch("/api/bookmark", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
        setBookmarkCount((prevCount) =>
          bookmarked ? prevCount - 1 : prevCount + 1
        );
        window.dispatchEvent(new CustomEvent("bookmarkUpdate"));
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };
  
  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("postId", id.toString());
    formData.append("content", editContent);
    if (editFile) {
      formData.append("file", editFile);
    }

    const response = await fetch("/api/posts", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Megakadályozza a kattintási esemény buborékolását
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Megakadályozza a kattintási esemény buborékolását
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        onDelete?.(id);

        const savedBookmarks = localStorage.getItem("bookmarkedPosts");
        if (savedBookmarks) {
          const bookmarkedPosts = JSON.parse(savedBookmarks);
          const updatedBookmarks = bookmarkedPosts.filter(
            (post: PostProps) => post.id !== id
          );
          localStorage.setItem(
            "bookmarkedPosts",
            JSON.stringify(updatedBookmarks)
          );
          window.dispatchEvent(new Event("bookmarkUpdate"));
        }
      }
    } catch (error) {
      console.error("Hiba történt a törlés során:", error);
    }
    setShowDeleteConfirm(false);
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const method = liked ? "DELETE" : "POST";
      const response = await fetch("/api/like", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

        if (liked && onLikeRemove) {
          onLikeRemove();
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  // Modál renderelése Portal segítségével
  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    
    // Csak böngészőben rendereljük (NextJS SSR compatibility)
    if (typeof document === 'undefined') return null;
    
    return ReactDOM.createPortal(
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowDeleteConfirm(false);
        }}
      >
        <div 
          className="p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl transition-all duration-300 shadow-md hover:shadow-xl border border-gray-800 w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white text-xl font-bold mb-6 text-center">
            Are you sure you want to delete this post?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div 
      className={`p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl mx-3 my-6 ${!fullImage ? 'hover:translate-y-[-2px]' : ''} transition-all duration-300 shadow-md hover:shadow-xl border border-gray-800`}
      onClick={fullImage ? undefined : handlePostClick}
    >
      {/* Törlési megerősítő modál Portal használatával */}
      {renderDeleteConfirmModal()}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
          {/* Profilkép konténer - színes keret nélkül */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={profileImage}
              alt={author}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
  
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-white text-base">{author}</h1>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
        </div>
        {!hideInteractions && (
          <div className="flex items-center space-x-6" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleLike} 
              data-testid="like-button" 
              className="flex items-center space-x-2 p-2 hover:bg-gray-800/30 rounded-full transition-colors"
            >
              <p className={liked ? "text-red-600" : "text-white"} data-testid="like-count">{likeCount} </p>
              <Heart className={liked ? "text-red-600" : "text-white"} />
            </button>
            <button
              onClick={handleBookmark} 
              data-testid="bookmark-button"
              className="flex items-center space-x-2 p-2 hover:bg-gray-800/30 rounded-full transition-colors"
            >
              <p className={bookmarked ? "text-blue-500" : "text-white"} data-testid="bookmark-count">
                {bookmarkCount}
              </p>
              <Bookmark className={bookmarked ? "text-blue-500" : "text-white"} />
            </button>
          </div>
        )}
      </div>
  
      <div className="pt-5" data-testid="post-content">
        {/* Módosított szöveg megjelenítés korlátozással */}
        <p className={`mb-4 text-gray-200 leading-relaxed ${!fullImage ? 'line-clamp-3 overflow-hidden' : ''}`}>
          {currentContent}
        </p>
        {currentImageSrc && (
          <div className={`overflow-hidden rounded-xl ${!fullImage ? 'max-h-96' : ''} mt-4 shadow-inner`}>
            <Image
              src={currentImageSrc}
              alt="Post Image"
              width={5000}
              height={5000}
              className={`w-full ${!fullImage ? 'object-cover hover:scale-[1.02] transition-transform duration-500' : 'object-contain'}`}
            /> 
          </div>
        )}
      </div>
  
      {showActions && !isEditing && (
        <div className="flex justify-end space-x-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>Edit</span>
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            data-testid="delete-button"
            className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>Delete</span>
            <Trash2 size={16} />
          </button>
        </div>
      )}
  
      {showActions && isEditing && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg h-32 resize-none focus:ring-2 focus:ring-orange-650 focus:outline-none"
            placeholder="Add a description..."
          />
  
          <input
            type="file"
            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            className="flex-1 text-sm text-gray-400 file:mr-2 file:py-1.5 file:px-4 file:rounded-lg 
              file:border-0 file:text-sm file:font-medium
            file:bg-orange-600 file:text-white hover:file:bg-orange-700 transition-colors"
            accept="image/*"
          />
  
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </button>
  
            <button
              onClick={handleEdit}
              className="px-4 py-1 m-1 min-w-[6rem] rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );  
}
