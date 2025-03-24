"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";
import Post from "../postSablon/post";
import { Trash2 } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  post?: {
    id: number;
    content: string;
    imageURL?: string;
    likes: { userId: number; username: string }[];
    bookmarks: { userId: number; username: string }[];
    user: {
      username: string;
      profileImage?: string;
    };
  };
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "new_post" && notification.post) {
      setSelectedPostId(notification.post.id === selectedPostId ? null : notification.post.id);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-lg font-semibold">No notifications yet</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {notifications.map((notification) => (
              <div key={notification.id} className="group relative">
                <div className="flex items-start justify-between bg-black p-4 rounded-lg border border-gray-600 hover:bg-gray-900 transition-all">
                  <div 
                    onClick={() => handleNotificationClick(notification)}
                    className="flex-1 flex items-start gap-4 cursor-pointer"
                  >
                    {/* Profilkép kezelése */}
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={
                          notification.type === "follow" 
                            ? "/yeti_pfp.jpg" // Követési értesítések alapértelmezett képe
                            : notification.post?.user?.profileImage || "/yeti_pfp.jpg"
                        }
                        alt="User avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>

                    <div>
                      <p className="text-white">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    className="text-gray-400 hover:text-orange-650 p-2 rounded-full hover:bg-gray-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Poszt tartalom megjelenítése */}
                {notification.type === "new_post" && notification.post?.id === selectedPostId && (
                  <div className="mt-4">
                    <Post
                      id={notification.post.id}
                      author={notification.post.user.username}
                      date={new Date(notification.createdAt).toLocaleDateString()}
                      content={notification.post.content}
                      imageSrc={notification.post.imageURL}
                      initialLikes={notification.post.likes.length}
                      initialBookmarks={notification.post.bookmarks.length}
                      profileImage={notification.post.user.profileImage || "/yeti_pfp.jpg"}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <RightSideMenu />
    </div>
  );
}
