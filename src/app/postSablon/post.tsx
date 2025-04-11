"use client";

import Image from "next/image";
import { Dot, Heart, Bookmark, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const handleDelete = async () => {
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

        // Könyvjelzők frissítése
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

  return (
    <div className="p-6 bg-black rounded-xl mx-3 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Profilkép konténer */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={profileImage}
              alt={author}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-bold text-white">{author}</h1>
          <h1 className="flex text-gray-400">
            <Dot />
            {date}
          </h1>
        </div>
        {!hideInteractions && (
          <div className="flex items-center space-x-6">
            <button onClick={handleLike} data-testid="like-button" className="flex items-center space-x-2">
              <p className={liked ? "text-red-600" : "text-white"} data-testid="like-count">{likeCount} </p>
              <Heart className={liked ? "text-red-600" : "text-white"} />
            </button>
            <button
              onClick={handleBookmark} data-testid="bookmark-button"
              className="flex items-center space-x-2"
            >
              <p className={bookmarked ? "text-blue-500" : "text-white"} data-testid="bookmark-count">
                {bookmarkCount}
              </p>
              <Bookmark className={bookmarked ? "text-blue-500" : "text-white"} />
            </button>
          </div>
        )}
      </div>

      <div className="pt-5" onClick={handlePostClick} data-testid="post-content">
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
        <div className="mt-4">
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
