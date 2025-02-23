"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import ProfilePosts from "../profilePosts/page";
import ProfileLikes from "../profileLikes/page";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: "",
    description: "",
    profileImage: "/yeti_pfp.jpg",
    coverImage: "/cover.jpg",
  });

  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

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
          setNewDescription(data.description || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("description", newDescription);
      if (profileFile) formData.append("profileImage", profileFile);
      if (coverFile) formData.append("coverImage", coverFile);

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
  
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {/* Cover Image */}
        <div className="relative bg-gray-800 h-48">
          <Image
            src={user.coverImage || "/cover.jpg"}
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
          />
          {/* Profile Picture */}
          <div className="absolute bottom-[-40px] left-5">
            <Image
              src={user.profileImage || "/yeti_pfp.jpg"}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-2 border-dark-gray"
            />
          </div>
        </div>
  
        {/* User Info Section */}
        <div className="p-5 pt-14">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold text-xl ml-5">{user.username}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1 rounded-lg font-bold text-white bg-orange-650 hover:bg-orange-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
  
          {isEditing ? (
            <div className="mt-4">
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 bg-gray-800 text-white rounded"
                placeholder="Add a description..."
              />
              <div className="mt-2 space-y-2">
                <input
                  type="file"
                  onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                  className="text-white"
                  accept="image/*"
                />
                <input
                  type="file"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="text-white"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-orange-650 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white mt-5">{user.description}</p>
          )}
        </div>
  
        {/* Tabs */}
        <div className="flex border-b border-gray-500">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 text-center ${
              activeTab === 'posts' ? 'text-orange-650' : 'text-gray-300'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 text-center ${
              activeTab === 'likes' ? 'text-orange-650' : 'text-gray-300'
            }`}
          >
            Likes
          </button>
        </div>
  
        {/* Content */}
        {activeTab === 'posts' && <ProfilePosts />}
        {activeTab === 'likes' && <ProfileLikes />}
      </main>
  
      <RightSideMenu />
    </div>
  );
}  