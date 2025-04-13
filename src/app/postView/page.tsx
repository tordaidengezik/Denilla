"use client";

import { useSearchParams, useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";
import { ArrowLeft, Trash2, Pencil, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Post from "../postSablon/post";

export default function PostView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("id"); // Az URL-ből kiolvassuk az ID-t

  interface Comment {
    id: number;
    content: string;
    userId: number;
    user: {
      id: number;
      username: string;
      profileImage?: string;
    };
  }

  interface Post {
    id: number;
    user: {
      username: string;
      profileImage: string;
    };
    date: string;
    content: string;
    createdAt: string;
    imageURL?: string;
    likes: { userId: number; username: string }[];
    bookmarks: { userId: number; username: string }[];
  }

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    profileImage?: string;
  } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  // Új állapotok a törlés megerősítéséhez
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  // Felhasználói adatok és szerepkörök lekérése
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Felhasználói profil lekérése
        const profileResponse = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          setCurrentUser(userData);
          console.log("User data loaded:", userData);
        }

        // Admin jogosultság ellenőrzése
        const adminResponse = await fetch("/api/auth/admin/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (adminResponse.ok) {
          setIsAdmin(true);
          console.log("User is admin");
        }
        
        // Moderátor jogosultság ellenőrzése
        const moderatorResponse = await fetch("/api/auth/moderator/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (moderatorResponse.ok) {
          setIsModerator(true);
          console.log("User is moderator");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCurrentUser();
  }, [router]);

  // Poszt lekérése
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  // Kommentek lekérése
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          console.log("Comments loaded:", data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // Új komment hozzáadása
  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content: newComment }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment(""); // Input mező törlése
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Komment szerkesztés kezdeményezése
  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // Komment szerkesztés mentése
  const handleSaveCommentEdit = async () => {
    if (!editCommentContent.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token || !editingCommentId) return;

      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          commentId: editingCommentId, 
          content: editCommentContent 
        }),
      });

      if (response.ok) {
        await response.json();
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === editingCommentId ? { ...c, content: editCommentContent } : c
          )
        );
        setEditingCommentId(null);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Komment törlés megerősítése
  const confirmDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  // Komment törlés végrehajtása
  const handleDeleteComment = async () => {
    try {
      if (!commentToDelete) return;
      
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: commentToDelete }),
      });

      if (response.ok) {
        // Távolítsuk el a törölt kommentet a listából
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentToDelete)
        );
        // Bezárjuk a modált
        setShowDeleteConfirm(false);
        setCommentToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!post) {
    return (
      <div className="text-center text-white">
        <h1>Post not found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
  
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {/* Vissza gomb */}
        <div className="sticky top-0 z-10 p-4 flex items-center space-x-2 bg-dark-gray/90 backdrop-blur-sm border-b border-gray-700">
          <button
            onClick={() => router.back()}
            className="text-white p-2 rounded-full hover:bg-orange-650 transition-all"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-white font-bold text-lg">Post</h2>
        </div>
  
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
            fullImage={true} // Teljes kép megjelenítése részletes nézetben
          />
        </div>
  
        {/* Kommentek */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl">Comments ({comments.length})</h2>
            <div className="h-0.5 flex-grow ml-4 bg-gradient-to-r from-gray-700 to-transparent"></div>
          </div>
  
          {/* Új komment írása */}
          <div className="mb-8 bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border border-gray-800">
            {/* Felhasználó adatok */}
            {currentUser && (
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src={currentUser.profileImage || "/yeti_pfp.jpg"} 
                  alt={currentUser.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-white font-medium">{currentUser.username}</span>
              </div>
            )}
            
            <div className="flex-grow">
              <textarea
                data-testid="comment-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full p-3 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-650 transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  data-testid="submit-comment-button"
                  className={`bg-orange-650 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all flex items-center space-x-2 ${
                    !newComment.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Add Comment</span>
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
  
          {/* Kommentek listája */}
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-400 text-lg font-medium">No comments yet</p>
              <p className="text-gray-500 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  data-testid="comment-content"
                  className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl border border-gray-800 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    {/* Felhasználói kép */}
                    <Image
                      src={comment.user.profileImage || "/yeti_pfp.jpg"}
                      alt={comment.user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {/* Komment tartalom */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold">{comment.user.username}</p>
                        
                        {/* Egyszerűsített jogosultság ellenőrzés felhasználónév alapján */}
                        {(currentUser && (
                          comment.user.username === currentUser.username || // saját komment
                          isAdmin || // admin jogosultság
                          isModerator // moderátor jogosultság
                        )) && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="text-gray-400 hover:text-orange-650 ml-2"
                              title="Edit comment"
                            >
                              <Pencil size={20} />
                            </button>
                            
                            {/* Törlés gomb csak saját kommenthez vagy adminnak */}
                            {(comment.user.username === currentUser?.username || isAdmin) && (
                              <button
                                onClick={() => confirmDeleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-500 ml-1"
                                title="Delete comment"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Szerkesztés mód vagy megjelenítés */}
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-650 resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <button
                              onClick={() => setEditingCommentId(null)}
                              className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveCommentEdit}
                              className="px-2 py-1 text-sm bg-orange-650 text-white rounded hover:bg-orange-700"
                              disabled={!editCommentContent.trim() || isSubmitting}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-300 mt-1">{comment.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
  
      <RightSideMenu />
      
      {/* Komment törlés megerősítő modál */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-600 w-full max-w-md mx-4">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-lg font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all w-full sm:w-36"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                className="px-6 py-2 rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700 transition-all w-full sm:w-36"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}
