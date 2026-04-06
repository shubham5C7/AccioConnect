import { AiOutlinePlus } from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa6";
import { BsChat } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useState } from "react";
import Modal from "./Modal";
import CreatePost from "./CreatePost";
import { Colors ,DEFAULT_AVATAR} from "../constants";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const isDark = useSelector((state) => state.theme.isDark);
   const user = useSelector((state) => state.posts.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <>
      {/* Hamburger  */}
      <div
        className={`fixed top-16 left-2 md:hidden z-50 ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
      >
        <RxHamburgerMenu
          size={26}
          className={`cursor-pointer ${isDark ? "text-gray-200" : "text-gray-800"}`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`
          h-full w-72 border z-40
          ${isDark ? "text-gray-200 border-gray-700" : "text-gray-800 border-gray-300"}
          md:relative md:block
          fixed
          ${isOpen ? "block" : "hidden md:block"}
        `}
        style={isDark ? { background: Colors.HomeBG, borderColor: "rgba(255,255,255,0.08)" } : {}}
      >
        <div className="space-y-2 mt-14 px-5">
          {/* Create Post */}
          <div
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
          >
            <AiOutlinePlus size={26} />
            Create Post
          </div>

          {/* Referral Post */}
          <div
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
          >
            <FaRegBookmark size={22} />
            Referral Post
          </div>

          {/* Chat */}
          <div
          onClick={()=>navigate("/chat")}
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
          >
            <BsChat size={24} />
            Chat
          </div>
        </div>

        <div className={`absolute bottom-6 left-0 right-0 px-5`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-2xl
            ${isDark 
              ? "border-white/10 bg-white/5" 
              : "border-gray-400 bg-gray-50"
            }`}
          >
            <img
              src={user?.profilePicture || DEFAULT_AVATAR}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <p className={`text-sm font-semibold truncate
                ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {user?.firstName} {user?.lastName}
              </p>
              <p className={`text-xs truncate
                ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                @ {user?.organizationName || "AccioConnect"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreatePost onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default SideBar;