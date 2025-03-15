"use client";

import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import { useState } from "react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState(""); 

  

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">

        {/* Keresőmező */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search for posts or profiles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-650"
          />
        </div>

        
        
      </main>

      <RightSideMenu />
    </div>
  );
}