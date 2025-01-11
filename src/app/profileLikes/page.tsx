import Profile from "../profileSablon/profile"

export default function ProfilePage() {
  const profileData = {
    name: "Yeti",
    description:
      "Enthusiast of statistics and data analysis. Sharing insights and exploring the world one dataset at a time.",
    coverImage: "/cover.jpg",
    profileImage: "/yeti_pfp.jpg",
    posts: [
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
        id: 3,
        author: "Yeti",
        date: "2018 September 09",
        content:
          "Embark on a voyage of a lifetime with One Piece. The epic anime series created by renowned mangaka Eiichiro Oda is a global phenomenon.",
        imageSrc: "/luffy.jpg",
        initialLikes: 120,
        initialBookmarks: 30,
      },
    ],
  };

  return (
    <Profile
      name={profileData.name}
      description={profileData.description}
      coverImage={profileData.coverImage}
      profileImage={profileData.profileImage}
      posts={profileData.posts}
    />
  );
}
