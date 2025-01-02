"use client";

import Image from "next/image";
import { useState } from "react";

interface CreatePostModalProps {
  onClose: () => void; // Bezárási logika
}

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-40"
        onClick={onClose} // Klikk a háttérre bezárja a modált
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="bg-black p-6 rounded-xl w-full max-w-4xl h-auto border border-gray-500 relative">
        
          {/* Header */}
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

          {/* Textarea */}
          <textarea
            placeholder="What's on your mind?"
            className="w-full min-h-[100px] max-h-[200px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none mb-6 overflow-y-auto"
          />

          {/* Image Upload */}
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

          {/* Uploaded Image Preview */}
          {uploadedImage && (
            <div className="flex justify-center items-center mt-4">
              <Image
                src={uploadedImage}
                alt="Uploaded"
                width={500}
                height={500}
                className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose} // Cancel bezárja a modált
              className="bg-gray-500 text-white px-4 py-2 w-32 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-orange-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onClose} // Post is bezárja a modált (módosítható)
              className="bg-orange-500 text-white px-4 py-2 w-32 rounded-xl hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
