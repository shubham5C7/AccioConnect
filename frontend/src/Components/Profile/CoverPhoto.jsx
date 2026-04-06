import { useState } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_AVATAR } from "../../constants";


const CoverPhoto = () => {
  const isDark = useSelector((state) => state.theme.isDark);
    const profileUser = useSelector((state) => state.posts.user); 
  const authUser = useSelector((state) => state.auth.currentUser);
  const user = profileUser || authUser || getUserFromStorage();
  
  const [coverLoading, setCoverLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);

  return (
    <div className="relative w-full">
      
      {/* Cover Image */}
      <div className="w-full h-56 md:h-72 rounded-t-2xl overflow-hidden bg-gray-200">
        {coverLoading && (
          <div className="w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700" />
        )}
        <img
          src={user?.profilePicture  || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"}
          alt="Cover"
          loading="lazy"
          onLoad={() => setCoverLoading(false)}
          onError={(e) => (e.currentTarget.src = "/default-cover.jpg")}
          className={`w-full h-full  object-cover transition-opacity duration-500 ${
            coverLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Profile Picture */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
        <div className={`w-42 h-42 rounded-full border-4 overflow-hidden ${
            isDark ? "border-gray-800" : "border-white"
          }`}
        >
          {avatarLoading && (
            <div className="w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full" />
          )}
          <img
            src={user?.profilePicture || DEFAULT_AVATAR}
            alt={`${user?.firstName} ${user?.lastName}`}
            loading="lazy"
            onLoad={() => setAvatarLoading(false)}
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              avatarLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>

    </div>
  );
};

export default CoverPhoto