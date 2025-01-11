"use client";

import SideMenu from '../sidemenu/page';
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import ProfileTopMenu from '../profileTopMenu/page';

interface PostData {
  id: number;
  author: string;
  date: string;
  content: string;
  imageSrc: string;
  initialLikes: number;
  initialBookmarks: number;
}

interface ProfileTemplateProps {
  name: string;
  description: string;
  coverImage: string;
  profileImage: string;
  posts: PostData[];
}

const Profile = ({
  name,
  description,
  coverImage,
  profileImage,
  posts,
}: ProfileTemplateProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        {/* Profil fejléc */}
        <div className="relative bg-gray-800 h-48">
          <Image
            src={coverImage}
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute bottom-[-40px] left-5">
            <Image
              src={profileImage}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-2 border-dark-gray"
            />
          </div>
        </div>

        {/* Felhasználó információk */}
        <div className="p-5 pt-14">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold text-xl ml-5">{name}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotified(!isNotified)}
                className={`p-2 rounded-full font-bold text-white transition-all ${
                  isNotified ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-650 hover:bg-orange-700"
                }`}
              >
                <Bell size={20} />
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-1 rounded-lg font-bold text-white transition-all ${
                  isFollowing ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-650 hover:bg-orange-700"
                }`}
              >
                {isFollowing ? "Followed" : "Follow"}
              </button>
            </div>
          </div>
          <p className="text-white mt-5">{description}</p>
        </div>

        <ProfileTopMenu />

        {/* Posztok */}
        {posts.map((post) => (
          <div key={post.id}>
            <Post
              id={post.id}
              author={post.author}
              date={post.date}
              content={post.content}
              imageSrc={post.imageSrc}
              initialLikes={post.initialLikes}
              initialBookmarks={post.initialBookmarks}
            />
            <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
          </div>
        ))}
      </main>

      <RightSideMenu />
    </div>
  );
};

export default Profile;
