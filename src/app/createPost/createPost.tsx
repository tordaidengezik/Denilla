"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
          // Ne használjunk Content-Type headert FormData esetén
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

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="bg-black p-6 rounded-xl w-full max-w-4xl h-auto border border-gray-500 relative">
          <div className="flex items-center space-x-4 mb-4">
            {/* Profilkép konténer */}
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={user.profileImage || "/yeti_pfp.jpg"}
                alt="Logo"
                width={50}
                height={50}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-white font-bold">{user.username}</h1>
          </div>
          <textarea
            data-testid="post-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] max-h-[200px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none mb-6 overflow-y-auto"
          />

          <div className="flex items-center space-x-4 mb-4">
            <label
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
              data-testid="img-upload-button"
            >
              Add Image
              <input
                type="file"
                accept="image/*"
                data-testid="file-upload-input"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedImage && (
            <div className="relative flex justify-center items-center mt-4">
              <Image
                src={uploadedImage}
                alt="Uploaded"
                width={500}
                height={500}
                className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 w-32 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-orange-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              data-testid="post-submit-button"
              disabled={!content && !file}
              className={`${
                !content && !file
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-orange-650 hover:bg-orange-500"
              } text-white px-4 py-2 w-32 rounded-xl focus:ring-2 focus:ring-orange-300 transition-all`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
