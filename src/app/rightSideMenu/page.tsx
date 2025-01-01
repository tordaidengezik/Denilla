"use client";

import Image from "next/image"

export default function RightSideMenu(){
    return(
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
    )
}