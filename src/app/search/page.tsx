"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";
import { useState } from "react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState(""); // Keresési állapot

  const posts = [
    {
      id: 1,
      author: "Yeti",
      date: "2022 December 12",
      content: "If the image is rectangular, using rounded-full will turn it into an oval shape unless the width and height are equal.",
      imageSrc: "/death-stranding.jpg",
      initialLikes: 234,
      initialBookmarks: 56,
    },
    {
        id: 2,
        author: "Yeti",
        date: "2024 November 21",
        content: "Explore the beauty of space with this stunning image.",
        imageSrc: "/tall_one_piece.jpg",
        initialLikes: 3224,
        initialBookmarks: 765,
      }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">

        {/* Keresőmező */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search for posts or profiles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Posztok megjelenítése */}
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
}