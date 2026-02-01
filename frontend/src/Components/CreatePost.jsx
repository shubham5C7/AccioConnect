import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosImages } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import FroalaEditor from "./FroalaEditor";
import DragAndDrop from "./DragAndDrop";
import { createPost} from '../features/postsSlice';
import {DEFAULT_AVATAR} from '../constants'

const CreatePost = ({ onClose }) => {
  const dispatch = useDispatch(); //  Get dispatch function
  /* Use the dark mood from the redux */
const isDark = useSelector((state) => state.theme.isDark);
  const [postData, setPostData] = useState({
    content: "",
    caption: "",
    contentType: "text",
     type: "general-post", // default type
    commentsEnabled: true,
    likesEnabled: true,
  });
  // UseState for the conditional rendering image/video and blog
  const [mode, setMode] = useState("blog");
    const [isReferral, setIsReferral] = useState(false); // toggle referral

  /* Take the profilePic from the local Storage */
  const profilePic = localStorage.getItem("profilePicture");
  // Get the user data from the localStorge
  const name = localStorage.getItem("name") || "User";

  // Calling the Api of Create post
  const handleCreatePost = async () => {
    // Check if the post is empty
    if (!postData.content.trim()) return;

    // Create payload dynamically
    const payload = {
      ...postData,
    type: isReferral ? "referral" : "general-post",
    };

   try{
    await dispatch(createPost(payload)).unwrap();

    //Reset form
        setPostData({
        content: "",
        caption: "",
        contentType: "text",
        type: "general-post",
        commentsEnabled: true,
        likesEnabled: true,
      });
      setIsReferral(false);

      if (onClose) onClose();
   }catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  const handleCancel = () => {
    setPostData({
      content: "",
      caption: "",
      contentType: "text",
      type:  "general-post",
      commentsEnabled: true,
      likesEnabled: true,
    });
     setIsReferral(false);
    if (onClose) onClose();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <img
          src={profilePic || DEFAULT_AVATAR}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-border"
        />
        <p className="text-xl font-medium text-foreground">{name}</p>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("image")}
            className={`flex h-9 px-4 rounded-lg items-center justify-center gap-2 text-sm font-medium transition-colors border
               ${
              mode === "image"
              ? isDark
                ?"bg-blue-600 border-blue-600 text-white  hover:bg-blue-700"
                : "bg-blue-500 border-blue-600 text-white  hover:bg-blue-600"
                : isDark
                ?  "bg-transparent border-gray-600 text-white hover:bg-blue-700"
                : "bg-transparent border-gray-400 text-black hover:bg-blue-300"
             }
            `}>
            <IoIosImages size={18} /> Image/Video
          </button>
          <button
            onClick={() => setMode("blog")}
            className={`flex h-9 px-4 rounded-lg items-center justify-center gap-2 text-sm font-medium transition-all duration-300 border
              ${
              mode === "blog"
                 ? isDark
                   ? "bg-blue-600 border-blue-600 text-white  hover:bg-blue-700"
                   : "bg-blue-500 border-blue-600 text-white  hover:bg-blue-600"
                   :isDark
                    ? "bg-transparent border-gray-600 text-white hover:bg-blue-700"
                    : "bg-transparent border-gray-400 text-black hover:bg-blue-300"
            }
            `}>
            <FaRegNewspaper size={16} /> Blog
          </button>
        </div>
        {/* Referral Button */}
<button 
  onClick={() => setIsReferral(!isReferral)}
  className={`flex h-9 px-4 items-center justify-center gap-2 rounded-lg ml-auto border font-medium transition-all duration-300

  ${
    isReferral
      ? isDark
        ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
        : "bg-green-500 border-green-500 text-white hover:bg-green-600"
      : isDark
        ? "border-gray-600 text-white hover:bg-green-700"
        : "border-gray-400 text-black hover:bg-green-100"
  }
  `}
>
          <FaUserPlus size={18} /> Referral
        </button>
      </div>
           {/* Caption */}
      <div>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={postData.caption}
          onChange={(e) => setPostData({ ...postData, caption: e.target.value })}
          className={`mt-2 border border-gray-500 w-full h-8 rounded-lg p-4 ${
            isDark ? "bg-transparent text-white" : "bg-white text-black"
          }`}
        />
      </div>
      {/* Content Editor */}
      <div className={`w-full mt-2 rounded-lg relative overflow-hidden `}>
       <div className={`transition-opacity duration-500 ${mode === "blog" ? "opacity-100" :"opacity-0 absolute invisible"}`}> 
         <FroalaEditor postData={postData} setPostData={setPostData} />
       </div>
       <div className={`transition-opacity duration-500 ${mode === "image" ? "opacity-100" :"opacity-0 absolute invisible"}`}>
        <DragAndDrop postData={postData} setPostData={setPostData} />
       </div>
      </div>

      {/* Checkboxes for disable likes and comments */}
      <div className="flex items-center gap-6 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!postData.likesEnabled}
            onChange={(e) =>
              setPostData({ ...postData, likesEnabled: !e.target.checked })
            }
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Disable Likes
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!postData.commentsEnabled}
            onChange={(e) =>
              setPostData({ ...postData, commentsEnabled: !e.target.checked })
            }
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Disable Comments
          </span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleCreatePost}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium border border-transparent active:scale-95 active:bg-blue-800 active:border-white  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-150"
        >
          Post
        </button>
      </div>
    </>
  );
};
export default CreatePost;