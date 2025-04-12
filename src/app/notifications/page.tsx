"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";
import Post from "../postSablon/post";
import { Trash2, UserPlus, Heart, FileText } from "lucide-react";

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
    likes: { userId: number }[];
    bookmarks: { userId: number }[];
    user: {
      id: number;
      username: string;
      profileImage?: string;
    };
  };
  fromUser?: {
    id: number;
    username: string;
    profileImage?: string;
  };
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [notificationType, setNotificationType] = useState<'all' | 'follow' | 'like' | 'new_post'>('all');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Alap értesítések (like, follow) és követett felhasználók posztértesítéseinek lekérése
        const [generalNotificationsRes, followingPostsRes] = await Promise.all([
          fetch("/api/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/notifications/following-posts", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        let allNotifications: Notification[] = [];
        
        if (generalNotificationsRes.ok) {
          const generalData = await generalNotificationsRes.json();
          // Kiszűrjük a new_post típusú értesítéseket az általános értesítések közül
          const filteredGeneral = generalData.filter((n: Notification) => n.type !== "new_post");
          allNotifications = [...filteredGeneral];
        }
        
        if (followingPostsRes.ok) {
          const followingPostsData = await followingPostsRes.json();
          console.log("Following posts notifications:", followingPostsData.length);
          allNotifications = [...allNotifications, ...followingPostsData];
        }
        
        // Rendezzük az értesítéseket dátum szerint csökkenő sorrendbe
        allNotifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "new_post" && notification.post) {
      setSelectedPostId(
        notification.post.id === selectedPostId ? null : notification.post.id
      );
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Egyszerűsített szűrési logika - nincs szükség followingUsers ellenőrzésre
  const filteredNotifications = notifications.filter(notification => 
    notificationType === 'all' || notification.type === notificationType
  );

  // Értesítések számának kiszámítása típusonként - egyszerűsített
  const counts = {
    follow: notifications.filter(n => n.type === 'follow').length,
    like: notifications.filter(n => n.type === 'like').length,
    new_post: notifications.filter(n => n.type === 'new_post').length
  };


  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full lg:w-3/4 min-[1300px]:w-2/4 h-full overflow-y-scroll scrollbar-hide bg-dark-gray border-l border-r border-gray-500">
        <h1 className="text-white text-center text-2xl font-bold mt-6 mb-4">Notifications</h1>
        
        {/* Értesítés típus szűrő */}
        <div className="flex justify-between mt-2 w-full px-4 sm:px-8 md:px-12 lg:px-20">
          <button
            onClick={() => setNotificationType('all')}
            className={`font-bold transition-all text-base sm:text-lg pb-2 ${
              notificationType === 'all' 
                ? 'text-orange-650' 
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setNotificationType('follow')}
            className={`font-bold transition-all text-base sm:text-lg pb-2 flex items-center ${
              notificationType === 'follow' 
                ? 'text-orange-650' 
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            <UserPlus size={16} className="mr-1" />
            Follows
            {counts.follow > 0 && (
              <span className="ml-1 text-xs bg-orange-650 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {counts.follow}
              </span>
            )}
          </button>
          <button
            onClick={() => setNotificationType('like')}
            className={`font-bold transition-all text-base sm:text-lg pb-2 flex items-center ${
              notificationType === 'like' 
                ? 'text-orange-650' 
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            <Heart size={16} className="mr-1" />
            Likes
            {counts.like > 0 && (
              <span className="ml-1 text-xs bg-orange-650 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {counts.like}
              </span>
            )}
          </button>
          <button
            onClick={() => setNotificationType('new_post')}
            className={`font-bold transition-all text-base sm:text-lg pb-2 flex items-center ${
              notificationType === 'new_post' 
                ? 'text-orange-650' 
                : 'text-gray-300 hover:text-gray-100'
            }`}
          >
            <FileText size={16} className="mr-1" />
            Posts
            {counts.new_post > 0 && (
              <span className="ml-1 text-xs bg-orange-650 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {counts.new_post}
              </span>
            )}
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-gray-400 mb-2">
              {notifications.length === 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              )}
            </div>
            <p className="text-lg font-semibold text-white">
              {notifications.length === 0 
                ? "No notifications yet" 
                : `No ${notificationType === 'all' ? '' : notificationType} notifications`}
            </p>
            <p className="text-gray-400 mt-2 max-w-md">
              {notifications.length === 0 
                ? "You'll see notifications about your activity here" 
                : "Try selecting a different filter to see other notifications"}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="group relative" data-testid="notification-item">
                <div 
                  className={`flex items-start justify-between bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg mb-2`}
                >
                  <div 
                    onClick={() => handleNotificationClick(notification)}
                    className="flex-1 flex items-start gap-4 cursor-pointer"
                  >
                    {/* Profilkép az értesítéshez */}
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={
                          notification.type === "follow" || notification.type === "like"
                            ? notification.fromUser?.profileImage || "/yeti_pfp.jpg"
                            : notification.post?.user?.profileImage || "/yeti_pfp.jpg"
                        }
                        alt="User avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                      {/* Értesítés típus ikon */}
                      <div className={`absolute -bottom-1 -right-1 rounded-full p-1 
                        ${notification.type === 'follow' ? 'bg-blue-600' : 
                          notification.type === 'like' ? 'bg-red-600' : 'bg-green-600'}`}>
                        {notification.type === 'follow' && <UserPlus size={10} className="text-white" />}
                        {notification.type === 'like' && <Heart size={10} className="text-white" />}
                        {notification.type === 'new_post' && <FileText size={10} className="text-white" />}
                      </div>
                    </div>
  
                    <div className="flex-1">
                      {/* Üzenet szövege */}
                      <p className="text-white">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
  
                  {/* Törlés gomb */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    data-testid="delete-notification-button"
                    className="text-gray-400 hover:text-orange-650 p-2 rounded-full hover:bg-gray-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
  
                {/* Poszt tartalom megjelenítése csak new_post típusnál */}
                {notification.type === "new_post" && notification.post?.id === selectedPostId && (
                  <div className="mt-4">
                    <Post
                      id={notification.post.id}
                      author={notification.post.user.username}
                      date={new Date(notification.createdAt).toLocaleDateString()}
                      content={notification.post.content}
                      imageSrc={notification.post.imageURL}
                      initialLikes={notification.post.likes?.length || 0}
                      initialBookmarks={notification.post.bookmarks?.length || 0}
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
