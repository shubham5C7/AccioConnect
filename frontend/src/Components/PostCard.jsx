import React, { useEffect, useRef, useState } from "react";
import { useSelector,useDispatch  } from "react-redux";
import { FaRegHeart, FaHeart, FaRegCommentDots, FaEllipsisV } from "react-icons/fa";
import { deletePost, toggleLikes } from "../features/postsSlice";
import {timeAgo } from "../constants"

const PostCard = ({post}) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const { user} = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false); // State for the Delete and edit 
  const menuRef = useRef();

  // Add early return if post is undefined
if (!post) {  return null; }

  // Safe check for likes - THIS IS THE FIX
  const likes = post.likes || [];
  const isLiked = likes.some(like => like.userId === user?._id);

   const handleLike = () => {
    dispatch(toggleLikes({ postId: post._id }));
  };

  useEffect(()=>{
// Close menu when clicking outSide
  const handler = (e)=>{
    if(menuRef.current && !menuRef.current.contains(e.target)){
      setShowMenu(false);
    }
  };
   document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  },[dispatch])

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-2xl p-4 mb-6 backdrop-blur-xl transition-all duration-300
      ${isDark? "bg-[#0b0f17]/80 border border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)]": "bg-white border border-gray-200 text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={ post.user?.profilePicture}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border border-white/20"
          />
          <div>
            <p className="font-semibold leading-none">{post.user?.firstName} {post.user?.lastName}</p>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {timeAgo(post.createdAt)} ago
            </p>
          </div>
        </div>
        {/* ONLY OWNER */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-700/30 rounded-lg transition"
        >
          <FaEllipsisV size={18} />
        </button>
        {showMenu && (
          <div
            className={`absolute right-0 mt-2 w-36 rounded-xl overflow-hidden shadow-xl border backdrop-blur-xl z-50
            ${isDark ? "bg-[#0f1623]/95 border-white/10" : "bg-white border-gray-200"}`}>
            
            {/* Edit and Delete now show on ALL posts */}
            <button
              onClick={() => {
                setShowMenu(false);
                alert("Open edit modal here"); // connect edit modal
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500/10 transition"
            >
              Edit post
            </button>

            <button
              onClick={() => {
                console.log("Delete button clicked, postId:", post._id); 
                dispatch(deletePost({ postId: post._id}));
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              Delete post
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                alert("Report post");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500/10 transition"
            >
              Report post
            </button>
          </div>
        )}
      </div>
      </div>
   
      {/* Caption */}
      {post.caption && (
        <p className="mt-3 text-[15px] leading-relaxed">{post.caption}</p>
      )}

      {/* Content Section - Handle both text and image */}
      {post.content && post.contentType === "image" && (
        <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
          <img
            src={post.content}
            alt="post"
            className="w-full max-h-[420px] object-cover"
          />
        </div>
      )}
      {post.content && post.contentType === "text" && (
        <div 
          className={`mt-3 text-[15px] leading-relaxed froala-content ${
            isDark ? "text-white" : "text-gray-800"
          }`}
          dangerouslySetInnerHTML={{ __html: post.content }}  // HTML styling for the forala editior emojied
          style={{wordWrap: 'break-word',overflowWrap: 'break-word'}} />
      )}      
       
      {/* Action Bar (ONLY if enabled from backend) */}
      <div className="flex items-center gap-12 mt-4 pt-3 border-t border-white/10">
        {!post.isLikeDisable && (
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition ${isLiked ? "text-red-500":"text-gray-400 hover:text-red-400"}`}>
            
            {isLiked ? <FaHeart size={20}/> : <FaRegHeart size={20}/>}
            <span className="text-sm">{likes.length}</span>
          </button>
        )}
        {/* isCommentDisable (not isCommentDisabled) */}
        {!post.isCommentDisable && (
          <div className="flex items-center gap-2 text-gray-400">
            <FaRegCommentDots size={20} />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
