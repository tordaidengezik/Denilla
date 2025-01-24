"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function RightSideMenu() {
  const router = useRouter(); 

  // Követési állapotok tárolása
  const [followingState, setFollowingState] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // Követési állapot váltása
  const toggleFollow = (id: number) => {
    setFollowingState((prevState) => ({
      ...prevState, 
      [id]: !prevState[id], 
    }));
  };

  return (
    <nav className="w-full md:w-1/4 h-1/4 md:h-full p-4 overflow-auto bg-dark-gray">
      {/* Who to Follow szekció */}
      <div className="border border-gray-500 rounded-lg p-4 bg-black mb-6">
        <h2 className="text-white font-bold mb-4">Who to Follow</h2>
        <ul className="space-y-1"> {/* Csökkentett távolság a profilok között */}
          {[
            { id: 1, name: "John Doe", image: "/yeti_pfp.jpg" },
            { id: 2, name: "Jane Smith", image: "/yeti_pfp.jpg" },
            { id: 3, name: "Chris Johnson", image: "/yeti_pfp.jpg" },
            { id: 4, name: "Patricia Brown", image: "/yeti_pfp.jpg" },
            { id: 5, name: "Michael Lee", image: "/yeti_pfp.jpg" },
          ].map((profile) => (
            <li
              key={profile.id}
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-900 transition"
            >
              {/* Navigáció a profil oldalra */}
              <div
                onClick={() => router.push("/profile")} // Navigáció a profil oldalra
                className="flex items-center space-x-3 w-full"
              >
                {/* Profilkép */}
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {/* Profilnév */}
                <p className="text-white">{profile.name}</p>
              </div>

              {/* Follow gomb */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Megakadályozza a doboz kattintási eseményét
                  toggleFollow(profile.id); // Követési állapot váltása
                }}
                className={`px-4 py-1 rounded-lg font-bold text-white transition-all ${
                  followingState[profile.id]
                    ? "bg-orange-700 hover:bg-orange-800"
                    : "bg-orange-650 hover:bg-orange-700"
                }`}
              >
                {followingState[profile.id] ? "Followed" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Trends Today szekció */}
      <div className="border border-gray-500 rounded-lg p-4 bg-black">
        <h2 className="text-white font-bold mb-4">Top Trends Today</h2>
        <ul className="space-y-2">
          <li>
            <p className="text-gray-500 opacity-70">1 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)} 
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #NextJs
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">2 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)} 
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #React
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">3 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)} 
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #JavaScript
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">4 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)} 
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #TailwindCSS
            </a>
          </li>
          <li>
            <p className="text-gray-500 opacity-70">5 - trending</p>
            <a
              onClick={() => router.push(`/postView?id=1`)} 
              className="text-orange-650 hover:underline cursor-pointer"
            >
              #WebDevelopment
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
