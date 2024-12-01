"use client";

import SideMenu from '../sidemenu/page';
import TopMenu from '../topmenu/page';
import Image from 'next/image';
import { Dot, Heart, Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const [topLikes, setTopLikes] = useState(234);
    const [topLiked, setTopLiked] = useState(false);
    const [topBookmarks, setTopBookmarks] = useState(56);
    const [topBookmarked, setTopBookmarked] = useState(false);

    const [midLikes, setMidLikes] = useState(3224);
    const [midLiked, setMidLiked] = useState(false);
    const [midBookmarks, setMidBookmarks] = useState(765);
    const [midBookmarked, setMidBookmarked] = useState(false);

    const [mid2Likes, setMid2Likes] = useState(3224);
    const [mid2Liked, setMid2Liked] = useState(false);
    const [mid2Bookmarks, setMid2Bookmarks] = useState(765);
    const [mid2Bookmarked, setMid2Bookmarked] = useState(false);

    const [bottomLikes, setBottomLikes] = useState(120);
    const [bottomLiked, setBottomLiked] = useState(false);
    const [bottomBookmarks, setBottomBookmarks] = useState(30);
    const [bottomBookmarked, setBottomBookmarked] = useState(false);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <SideMenu />

            <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
                <TopMenu />
                
                {/* Felső Post */}
                <div className="p-4">
                    <div className="p-4 bg-black border border-gray-500 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="/yeti_pfp.jpg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <h1 className="font-bold text-white">Yeti</h1>
                                <h1 className="flex text-gray-400">
                                    <Dot />
                                    2022 December 12
                                </h1>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => {
                                        setTopLiked(!topLiked);
                                        setTopLikes(topLiked ? topLikes - 1 : topLikes + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={topLiked ? "text-red-600" : "text-white"}>{topLikes}</p>
                                    <Heart className={topLiked ? "text-red-600" : "text-white"} />
                                </button>

                                <button
                                    onClick={() => {
                                        setTopBookmarked(!topBookmarked);
                                        setTopBookmarks(topBookmarked ? topBookmarks - 1 : topBookmarks + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={topBookmarked ? "text-blue-500" : "text-white"}>{topBookmarks}</p>
                                    <Bookmark className={topBookmarked ? "text-blue-500" : "text-white"} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-5">
                            <p>
                                If the image is rectangular, using rounded-full will turn it into an oval
                                shape unless the width and height are equal. For a circular appearance,
                                ensure the image is square (width === height).
                            </p>
                            <Image
                                src="/death-stranding.jpg"
                                alt="Post Image"
                                width={5000}
                                height={5000}
                                className="rounded-xl pt-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Középső Post */}
                <div className="p-4">
                    <div className="p-4 bg-black border border-gray-500 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="/yeti_pfp.jpg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <h1 className="font-bold text-white">Yeti</h1>
                                <h1 className="flex text-gray-400">
                                    <Dot />
                                    2021 November 30
                                </h1>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => {
                                        setMidLiked(!midLiked);
                                        setMidLikes(midLiked ? midLikes - 1 : midLikes + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={midLiked ? "text-red-600" : "text-white"}>{midLikes}</p>
                                    <Heart className={midLiked ? "text-red-600" : "text-white"} />
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setMidBookmarked(!midBookmarked);
                                        setMidBookmarks(midBookmarked ? midBookmarks - 1 : midBookmarks + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={midBookmarked ? "text-blue-500" : "text-white"}>{midBookmarks}</p>
                                    <Bookmark className={midBookmarked ? "text-blue-500" : "text-white"} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-5">
                            <p>
                                If the image is rectangular, using rounded-full will turn it into an oval
                                shape unless the width and height are equal. For a circular appearance,
                                ensure the image is square (width === height).
                            </p>
                            <Image
                                src="/space.webp"
                                alt="Post Image"
                                width={5000}
                                height={5000}
                                className="rounded-xl pt-3"
                            />
                        </div>
                    </div>
                </div>

                {/* Középső Post 2 */}
                <div className="p-4">
                    <div className="p-4 bg-black border border-gray-500 rounded-xl max-h-[600px] overflow-hidden relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="/yeti_pfp.jpg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <h1 className="font-bold text-white">Yeti</h1>
                                <h1 className="flex text-gray-400">
                                    <Dot />
                                    2024 November 21
                                </h1>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => {
                                        setMid2Liked(!mid2Liked);
                                        setMid2Likes(mid2Liked ? mid2Likes - 1 : mid2Likes + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={mid2Liked ? "text-red-600" : "text-white"}>{mid2Likes}</p>
                                    <Heart className={mid2Liked ? "text-red-600" : "text-white"} />
                                </button>
                                
                                <button
                                    onClick={() => {
                                        setMid2Bookmarked(!mid2Bookmarked);
                                        setMid2Bookmarks(mid2Bookmarked ? mid2Bookmarks - 1 : mid2Bookmarks + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={mid2Bookmarked ? "text-blue-500" : "text-white"}>{mid2Bookmarks}</p>
                                    <Bookmark className={mid2Bookmarked ? "text-blue-500" : "text-white"} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-5">
                            <p>
                                If the image is rectangular, using rounded-full will turn it into an oval
                                shape unless the width and height are equal. For a circular appearance,
                                ensure the image is square (width === height).
                            </p>
                            <div className="relative max-h-[400px] overflow-hidden rounded-xl">
                                <Image
                                    src="/space.webp"
                                    alt="Post Image"
                                    width={1400}
                                    height={3200}
                                    className="w-full h-full object-cover pt-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alsó Post */}
                <div className="p-4">
                    <div className="p-4 bg-black border border-gray-500 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Image
                                    src="/yeti_pfp.jpg"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <h1 className="font-bold text-white">Yeti</h1>
                                <h1 className="flex text-gray-400">
                                    <Dot />
                                    2018 September 09
                                </h1>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={() => {
                                        setBottomLiked(!bottomLiked);
                                        setBottomLikes(bottomLiked ? bottomLikes - 1 : bottomLikes + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={bottomLiked ? "text-red-600" : "text-white"}>{bottomLikes}</p>
                                    <Heart className={bottomLiked ? "text-red-600" : "text-white"} />
                                </button>

                                <button
                                    onClick={() => {
                                        setBottomBookmarked(!bottomBookmarked);
                                        setBottomBookmarks(bottomBookmarked ? bottomBookmarks - 1 : bottomBookmarks + 1);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <p className={bottomBookmarked ? "text-blue-500" : "text-white"}>{bottomBookmarks}</p>
                                    <Bookmark className={bottomBookmarked ? "text-blue-500" : "text-white"} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-5">
                            <p>
                                Embark on a voyage of a lifetime with One Piece. 
                                The epic anime series created by renowned mangaka Eiichiro Oda is 
                                a global phenomenon, captivating the hearts of fans across generations 
                                throughout its 25-year span. This thrilling high seas adventure is filled with 
                                unwavering friendship, epic battles for freedom, and the relentless pursuit of dreams. 
                                Join Monkey D. Luffy and his lovable pirate crew as they discover the true meaning 
                                of power and justice in this great pirate era.
                            </p>
                            <Image
                                src="/luffy.jpg"
                                alt="Post Image"
                                width={5000}
                                height={5000}
                                className="rounded-xl pt-3"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <nav className="w-full md:w-1/4 h-1/4 md:h-full p-4 overflow-auto bg-dark-gray">
                <div className="border border-gray-500 rounded-lg p-4 bg-black mb-6">
                    <h2 className="text-white font-bold mb-4">Who to Follow</h2>
                    <ul className="space-y-4">
                        {[
                            { id: 1, name: "John Doe", image: "/yeti_pfp.jpg" },
                            { id: 2, name: "Jane Smith", image: "/yeti_pfp.jpg" },
                            { id: 3, name: "Chris Johnson", image: "/yeti_pfp.jpg" },
                            { id: 4, name: "Patricia Brown", image: "/yeti_pfp.jpg" },
                            { id: 5, name: "Michael Lee", image: "/yeti_pfp.jpg" },
                        ].map((profile) => (
                            <li key={profile.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={profile.image}
                                        alt={profile.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <p className="text-white">{profile.name}</p>
                                </div>
                                <button className="bg-orange-500 text-white px-4 py-1 rounded-lg hover:bg-orange-600">
                                    Follow
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border border-gray-500 rounded-lg p-4 bg-black">
                    <h2 className="text-white font-bold mb-4">Top Trends Today</h2>
                    <ul className="space-y-2">
                        <li>
                            <p className="text-gray-500 opacity-70">1 - trending</p>
                            <a href="#" className="text-orange-500 hover:underline">
                                #NextJs
                            </a>
                        </li>
                        <li>
                            <p className="text-gray-500 opacity-70">2 - trending</p>
                            <a href="#" className="text-orange-500 hover:underline">
                                #React
                            </a>
                        </li>
                        <li>
                            <p className="text-gray-500 opacity-70">3 - trending</p>
                            <a href="#" className="text-orange-500 hover:underline">
                                #JavaScript
                            </a>
                        </li>
                        <li>
                            <p className="text-gray-500 opacity-70">4 - trending</p>
                            <a href="#" className="text-orange-500 hover:underline">
                                #TailwindCSS
                            </a>
                        </li>
                        <li>
                            <p className="text-gray-500 opacity-70">5 - trending</p>
                            <a href="#" className="text-orange-500 hover:underline">
                                #WebDevelopment
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}