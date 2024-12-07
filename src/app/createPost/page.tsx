"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
    const router = useRouter();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-dark-gray">
            <div className="bg-black p-6 rounded-xl w-full max-w-4xl h-auto border border-gray-500">
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
                    placeholder="What's on your mind?"
                    className="w-full min-h-40 max-h-80 p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none mb-6 overflow-y-auto"
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
                    <div className="flex justify-center items-center mt-4">
                        <div className="relative inline-block border border-gray-700 rounded-lg bg-gray-900">
                            <Image
                                src={uploadedImage}
                                alt="Uploaded"
                                width={500}
                                height={500}
                                className="w-auto h-auto max-w-full max-h-[500px] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-500 text-white px-4 py-2 w-32 rounded-xl hover:bg-gray-600 focus:ring-2 focus:ring-orange-300 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-orange-500 text-white px-4 py-2 w-32 rounded-xl hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}