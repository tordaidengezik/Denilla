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
    user: {
      username: string;
    };
    likes: { userId: number; username: string }[];
    bookmarks: { userId: number; username: string }[];
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Hiba történt az értesítések betöltésekor:", error);
      }
    };

    fetchNotifications();

    // Értesítések frissítése 30 másodpercenként
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "new_post" && notification.post) {
      setSelectedPostId(
        selectedPostId === notification.post.id ? null : notification.post.id
      );
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        // Frissítjük a state-et, eltávolítjuk a törölt értesítést
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
      }
    } catch (error) {
      console.error("Hiba történt az értesítés törlésekor:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="text-lg font-semibold">
              You dont have any notifications yet
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <div
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-center space-x-4 bg-black p-4 rounded-lg border border-gray-600 ${
                    !notification.read ? "bg-opacity-90" : "bg-opacity-50"
                  } ${
                    notification.type === "new_post"
                      ? "cursor-pointer hover:bg-gray-900"
                      : ""
                  }`}
                >
                  <Image
                    src="/yeti_pfp.jpg"
                    alt="User"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="flex items-center space-x-2">
                    <p className="text-white">{notification.message}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={20} />
                </button>

                {selectedPostId === notification.post?.id &&
                  notification.post && (
                    <div className="mt-4">
                      <Post
                        id={notification.post.id}
                        author={notification.post.user.username}
                        date={new Date(
                          notification.createdAt
                        ).toLocaleDateString()}
                        content={notification.post.content}
                        imageSrc={notification.post.imageURL}
                        initialLikes={notification.post.likes.length}
                        initialBookmarks={notification.post.bookmarks.length}
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
