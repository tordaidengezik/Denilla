'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import SideMenu from "../sidemenu/page";
import TopMenu from "../topmenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";



interface PostType {
  id: number;
  user: {
    username: string;
  };
  content: string;
  imageURL?: string;
  createdAt: string;
  likes: { userId: number; username: string }[];
  bookmarks: { userId: number; username: string }[];
}

export default function Layout() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Hiba történt a posztok betöltésekor:', response.statusText);
          setPosts([]);
        }
      } catch (error) {
        console.error('Hiba történt a posztok betöltésekor:', error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [router]); 



  // Ellenőrizzük, hogy van-e adat
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <SideMenu />
        <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
          <TopMenu />
          <div className="text-white text-center p-4">Nincsenek megjeleníthető posztok</div>
        </main>
        <RightSideMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        <TopMenu />
        {Array.isArray(posts) && posts.map((post) => (
          <div key={post.id}>
            <Post
              id={post.id}
              author={post.user.username}
              date={new Date(post.createdAt).toLocaleDateString()}
              content={post.content}
              imageSrc={post.imageURL}  // imageURL használata
              initialLikes={post.likes.length}
              initialBookmarks={post.bookmarks.length}
            />
            <hr className="w-4/5 border-gray-500 border-t-2 mx-auto" />
          </div>
        ))}
      </main>
      <RightSideMenu />
    </div>
  );
}
