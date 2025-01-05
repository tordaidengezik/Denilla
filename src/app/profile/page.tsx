"use client";

import SideMenu from '../sidemenu/page';
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post"; // Importáljuk a Post sablont
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import ProfileTopMenu from '../profileTopMenu/page';


export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false); 
  const [isNotified, setIsNotified] = useState(false); 

  const posts = [
    {
      id: 1,
      author: "Yeti",
      date: "2022 December 12",
      content:
        "If the image is rectangular, using rounded-full will turn it into an oval shape unless the width and height are equal.",
      imageSrc: "/death-stranding.jpg",
      initialLikes: 234,
      initialBookmarks: 56,
    },
    {
      id: 3,
      author: "Yeti",
      date: "2018 September 09",
      content:
        "Embark on a voyage of a lifetime with One Piece. The epic anime series created by renowned mangaka Eiichiro Oda is a global phenomenon.",
      imageSrc: "/luffy.jpg",
      initialLikes: 120,
      initialBookmarks: 30,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        <hr className="w-full border-gray-500 border-t-2 mx-auto" />

        {/* Profil fejléc */}
        <div className="relative bg-gray-800 h-48">
          {/* Borítókép */}
          <Image
            src="/cover.jpg"
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
          />
          {/* Profilkép */}
          <div className="absolute bottom-[-40px] left-5">
            <Image
              src="/yeti_pfp.jpg"
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
            {/* Név */}
              <h1 className="text-white font-bold text-xl ml-5">Yeti</h1>

            {/* Gombok */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
                <button
                    onClick={() => setIsNotified(!isNotified)} // Állapot váltása
                    className={`p-2 rounded-full font-bold text-white transition-all ${
                        isNotified ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-500 hover:bg-orange-700" }`}
                    >
                    <Bell size={20} />
                </button>

              {/* Following Button */}
              <button
                onClick={() => setIsFollowing(!isFollowing)} // Állapot váltása
                className={`px-4 py-1 rounded-lg font-bold text-white transition-all ${
                  isFollowing ? "bg-orange-700 hover:bg-orange-800" : "bg-orange-500 hover:bg-orange-700" }`}
              >
                {isFollowing ? "Followed" : "Follow"} {/* Felirat váltása */}
              </button>
            </div>
          </div>

          {/* Leírás */}
          <p className="text-white mt-5">
            Enthusiast of statistics and data analysis. Sharing insights and exploring the world one dataset at a time.
          </p>
        </div>

        <ProfileTopMenu />

        {/* Posztok */}
        {posts.map((post) => (
          <div key={post.id}>
            <Post
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
}
