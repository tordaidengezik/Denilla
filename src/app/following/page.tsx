"use client";

import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import TopMenu from "../topmenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";

export default function Layout() {
  const router = useRouter();

  // Manuális adatok (később helyettesíthetők adatbázisból érkező adatokkal)
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
      id: 2,
      author: "Yeti",
      date: "2024 November 21",
      content: "Explore the beauty of space with this stunning image.",
      imageSrc: "/tall_one_piece.jpg",
      initialLikes: 3224,
      initialBookmarks: 765,
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

      {/* Görgethető fő tartalom */}
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <TopMenu />

        {/* Posztok megjelenítése */}
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => router.push(`/postView?id=${post.id}`)} // Átadjuk az ID-t az URL-ben
            className="cursor-pointer"
          >
            <Post
              id={post.id}
              author={post.author}
              date={post.date}
              content={post.content}
              imageSrc={post.imageSrc}
              initialLikes={post.initialLikes}
              initialBookmarks={post.initialBookmarks}
            />
            <hr className="w-4/5 border-gray-500 border-t-1 mx-auto" />
          </div>
        ))}
      </main>

      <RightSideMenu />
    </div>
  );
}
