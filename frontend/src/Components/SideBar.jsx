import { AiOutlinePlus } from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa6";
import { BsChat } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useState } from "react";
import Modal from "./Modal";
import CreatePost from "./CreatePost";
import { Colors } from "../constants";

const SideBar = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [isOpen, setIsOpen] = useState(false); // Sidebar
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal

  return (
    <>
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
        className={`fixed   h-full w-55  rounded-2xl z-40 ${isDark ? " text-gray-200" : " text-gray-800"} md:relative md:block ${isOpen ? "block" : "hidden md:block"}`}
      >
        <div className="space-y-2 mt-9 ">
          {/*Create Post */}
          <div
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
            onClick={() =>{
               setIsModalOpen(true);  
                setIsOpen(false);}}
          >
            <AiOutlinePlus size={26} />
            Create Post
          </div>
          {/*Referral Post */}
          <div
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
          >
            <FaRegBookmark size={22} />
            Referral Post
          </div>
          {/* Chat */}
          <div
            className={`${Colors.SideBarBaseCSs} ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
          >
            <BsChat size={24} />
            Chat
          </div>
        </div>
      </div>

      {/* Overlay */}
 {isOpen && (
  <div
    className={`fixed inset-0 z-20 md:hidden ${isDark ? Colors.SideBarLightMode : Colors.SideBarDarkMode}`}
    onClick={() => setIsOpen(false)}  
  />
)}

      {/*Modal*/}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <CreatePost onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default SideBar;
