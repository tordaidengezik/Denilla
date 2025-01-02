"use client";

import Image from "next/image";
import { useState } from "react";

interface CreatePostModalProps {
  onClose: () => void;
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', '1'); // Később a bejelentkezett user ID-val helyettesítendő
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hiba történt a poszt létrehozásakor');
      }
  
      setContent('');
      setFile(null);
      setUploadedImage(null);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Hiba történt a poszt létrehozásakor:', error);
      throw new Error('Hiba történt a poszt létrehozásakor');
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
            <Image
              src="/yeti_pfp.jpg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="text-white font-bold">World of Statistics</h1>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] max-h-[200px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none mb-6 overflow-y-auto"
          />

          <div className="flex items-center space-x-4 mb-4">
            <label className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer">
              Add Image
              <input
                type="file"
                accept="image/*"
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
              <button
                onClick={() => {
                  setFile(null);
                  setUploadedImage(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              >
                X
              </button>
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
              disabled={!content && !file}
              className={`${
                !content && !file
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
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
