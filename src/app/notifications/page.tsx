import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Image from "next/image";

export default function NotificationPage() {
  // Példa értesítések
  const notifications = [
    {
      id: 1,
      userName: "John Doe",
      userImage: "/yeti_pfp.jpg",
      message: "has a new post",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userImage: "/yeti_pfp.jpg",
      message: "has a new post",
    },
    {
      id: 3,
      userName: "Chris Johnson",
      userImage: "/yeti_pfp.jpg",
      message: "has a new post",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />

      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">

        {/* Értesítések */}
        <div className="p-4 space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center space-x-4 bg-black p-4 rounded-lg border border-gray-600"
            >
              {/* Felhasználói kép */}
              <Image
                src={notification.userImage}
                alt={notification.userName}
                width={50}
                height={50}
                className="rounded-full"
              />

              {/* Szöveg (név és üzenet egymás mellett) */}
              <div className="flex items-center space-x-2">
                <p className="text-white font-bold">{notification.userName}</p>
                <p className="text-gray-400">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <RightSideMenu />
    </div>
  );
}