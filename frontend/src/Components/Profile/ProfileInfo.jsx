import { useSelector } from "react-redux";
import { getUserFromStorage } from "../../utils/storage";
import { FaEdit } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

const ProfileInfo = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const profileUser = useSelector((state) => state.posts.user);
  const authUser = useSelector((state) => state.auth.currentUser);
  const userPosts = useSelector((state) => state.posts.userPosts);
  const user = profileUser || authUser || getUserFromStorage();
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 pt-4 pb-6 px-4">

      {/* Name */}
      <h1 className="text-2xl font-bold">
        {user?.firstName} {user?.lastName}
      </h1>

      {/* Email */}
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {user?.email}
      </p>

      {/* Posts Count */}
      <div className="mt-2 text-center">
        <span className="font-bold text-lg">{userPosts?.length ?? 0}</span>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Posts</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-3">
        <button
          onClick={() => setShowEdit(true)}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <FaEdit size={16} />
          Edit Profile
        </button>

        {showEdit && (
          <EditProfileModal
            user={user}
            closeModal={() => setShowEdit(false)}
            refreshUser={() => {}}
          />
        )}

        <button
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          <BsChatDots size={16} />
          Message
        </button>
      </div>

    </div>
  );
};

export default ProfileInfo;