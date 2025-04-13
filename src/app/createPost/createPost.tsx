"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import ReactDOM from "react-dom";

interface CreatePostModalProps {
  onClose: () => void;
}

interface User {
  username: string;
  profileImage: string;
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    username: "",
    profileImage: "/yeti_pfp.jpg",
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Görgetés letiltása a modal megnyitásakor
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Tisztítás a modal bezárásakor
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Token dekódolása a user ID megszerzéséhez
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch (error) {
      console.error("Token dekódolási hiba:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) {
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("content", content);
      formData.append("userId", userId);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        // Token lejárt vagy érvénytelen
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Szerver hiba:", errorData.error);
        return;
      }

      setContent("");
      setFile(null);
      setUploadedImage(null);
      onClose();
      window.location.reload(); // Frissítjük az oldalt az új poszt megjelenítéséhez
    } catch (error) {
      console.error("Hiba történt a poszt létrehozásakor:", error);
    }
  };

  // React Portal használata - csak a kliens oldalon
  const renderModal = () => {
    // Ellenőrizzük, hogy a document objektum elérhető-e (csak kliens oldalon)
    if (typeof document === 'undefined') return null;
    
    return ReactDOM.createPortal(
      <>
        {/* Háttér elmosás és overlay - enyhébb átlátszatlanság (80%) és kisebb blur */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
          onClick={onClose}
          aria-hidden="true"
          tabIndex={-1}
        ></div>

        {/* Modal tartalom még magasabb z-index-szel */}
        <div className="fixed inset-0 z-[10000] flex justify-center items-center p-4">
          <div 
            className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl w-full max-w-4xl h-auto border border-gray-700 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center space-x-4 mb-4">
              {/* Profilkép konténer */}
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={user.profileImage || "/yeti_pfp.jpg"}
                  alt="Profile"
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-white font-bold text-lg">{user.username}</h1>
            </div>
            
            {/* Textarea */}
            <textarea
              data-testid="post-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full min-h-[100px] max-h-[200px] p-4 bg-gray-900/70 text-white border border-gray-700 rounded-lg resize-none mb-6 overflow-y-auto focus:ring-2 focus:ring-orange-650/50 focus:outline-none transition-all"
              autoFocus
            />

            <div className="flex items-center space-x-4 mb-4">
              <label
                className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 text-sm sm:text-base cursor-pointer flex items-center space-x-2"
                data-testid="img-upload-button"
              >
                <ImagePlus size={16} />
                <span>Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  data-testid="file-upload-input"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Kép megjelenítés az X gombbal */}
            {uploadedImage && (
              <div className="relative flex justify-center items-center mt-4">
                <Image
                  src={uploadedImage}
                  alt="Uploaded"
                  width={500}
                  height={500}
                  className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg"
                />
                {/* Kép eltávolítása gomb */}
                <button 
                  onClick={() => {
                    setFile(null);
                    setUploadedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-600 transition-all shadow-md"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Gombok a megadott stílusban */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg font-bold text-white transition-all bg-gray-600 hover:bg-gray-700 text-sm sm:text-base flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                data-testid="post-submit-button"
                disabled={!content && !file}
                className={`px-3 py-1 rounded-lg font-bold text-white transition-all ${
                  !content && !file
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-orange-650 hover:bg-orange-700"
                } text-sm sm:text-base flex-1 sm:flex-none`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  };

  return renderModal();
}
