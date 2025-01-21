"use client";

import { useSearchParams, useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';

export default function Layout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("id"); // Az URL-ből kiolvassuk az ID-t

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
      comments: [
        {
          id: 1,
          author: "John Doe",
          userImage: "/yeti_pfp.jpg",
          content: "This is an amazing post!",
        },
        {
          id: 2,
          author: "Jane Smith",
          userImage: "/yeti_pfp.jpg",
          content: "I totally agree with this.",
        },
        {
          id: 3,
          author: "Chris Johnson",
          userImage: "/yeti_pfp.jpg",
          content: "Great insights, thanks for sharing!",
        },
      ],
    },
    {
      id: 2,
      author: "Yeti",
      date: "2024 November 21",
      content: "Explore the beauty of space with this stunning image.",
      imageSrc: "/tall_one_piece.jpg",
      initialLikes: 3224,
      initialBookmarks: 765,
      comments: [
        {
          id: 1,
          author: "John Doe",
          userImage: "/yeti_pfp.jpg",
          content: "This is an amazing post!",
        },
        {
          id: 2,
          author: "Jane Smith",
          userImage: "/yeti_pfp.jpg",
          content: "I totally agree with this.",
        },
        {
          id: 3,
          author: "Chris Johnson",
          userImage: "/yeti_pfp.jpg",
          content: "Great insights, thanks for sharing!",
        },
        {
          id: 4,
          author: "John Doe",
          userImage: "/yeti_pfp.jpg",
          content: "This is an amazing post!",
        },
        {
          id: 5,
          author: "Jane Smith",
          userImage: "/yeti_pfp.jpg",
          content: "I totally agree with this.",
        },
        {
          id: 6,
          author: "Chris Johnson",
          userImage: "/yeti_pfp.jpg",
          content: "Great insights, thanks for sharing!",
        },
      ],
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
      comments: [
        {
          id: 1,
          author: "John Doe",
          userImage: "/yeti_pfp.jpg",
          content: "This is an amazing post!",
        },
        {
          id: 2,
          author: "Jane Smith",
          userImage: "/yeti_pfp.jpg",
          content: "I totally agree with this.",
        },
        {
          id: 3,
          author: "Chris Johnson",
          userImage: "/yeti_pfp.jpg",
          content: "Great insights, thanks for sharing!",
        },
      ],
    },
  ];

  // Kiválasztjuk azt a posztot, amelynek az ID-ja megegyezik az URL-ben kapott ID-val
  const post = posts.find((p) => p.id === Number(postId));

  if (!post) {
    return (
      <div className="text-center text-white">
        <h1>Post not found</h1>
        {/* Vissza gomb */}
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        {/* Vissza gomb */}
        <div className="p-4 flex items-center space-x-2">
          <button
            onClick={() => router.back()}
            className="text-white px-4 py-2 rounded-lg hover:bg-orange-650 transition-all"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-white font-bold text-lg">Post</h2>
        </div>

        {/* Poszt megjelenítése */}
        <div key={post.id}>
          <Post {...post} />
          
          {/* Kommentek */}
          <div className="p-4 space-y-4">
            <h2 className="text-white font-bold text-lg mb-3">Comments</h2>
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-center space-x-4 bg-black p-4 rounded-lg border border-gray-600"
              >
                {/* Felhasználói kép */}
                <Image
                  src={comment.userImage}
                  alt={comment.author}
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                {/* Szöveg (név és üzenet egymás mellett) */}
                <div className="flex flex-col">
                  <p className="text-white font-bold">{comment.author}</p>
                  <p className="text-gray-400">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RightSideMenu />
    </div>
  );
}
