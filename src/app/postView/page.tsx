<<<<<<< HEAD

=======
>>>>>>> 6cd064934ab47c6fd25e6457d4744a100f2cc06c
import SideMenu from "../sidemenu/page";
import RightSideMenu from "../rightSideMenu/page";
import Post from "../postSablon/post";
import Image from "next/image";

export default function Layout() {
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
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu />
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-dark-gray border-l border-r border-gray-500">
        
        {posts.map((post) => (
          <div key={post.id}>
            <Post {...post} />
            <hr className="w-4/5 border-gray-500 border-t-2 mx-auto mt-4" />

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
        ))}
      </main>
      <RightSideMenu />
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6cd064934ab47c6fd25e6457d4744a100f2cc06c
