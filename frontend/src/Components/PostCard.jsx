import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaRegHeart,
  FaHeart,
  FaRegCommentDots,
  FaEllipsisV,
} from "react-icons/fa";
import { deletePost, toggleLikes, optimisticLikeToggle } from "../features/postsSlice";
import { timeAgo } from "../constants";
import LikesSection from "./LikesSection"; 

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
 const user = useSelector((state) => state.posts.user);
   const likesLoading = useSelector((state) => state.posts.likesLoading); 
  const [showMenu, setShowMenu] = useState(false); // State for the Delete and edit
  const menuRef = useRef();

  // Add early return if post is undefined
  if (!post) {
    return null;
  }

  // Safe check for likes - THIS IS THE FIX
  const likes = post.likes || [];
  const isLiked = likes.some((like) => like.userId === user?._id);
    const isLiking = likesLoading?.[post._id] || false;

  const handleLike = async() => {

  
    dispatch(optimisticLikeToggle({
      postId:post._id,
      userId:user?._id,
    }));
    try{

      await dispatch(toggleLikes({
      postId : post._id,
      userId : user?._id,
      userName: `${user?.firstName} ${user?.lastName}`,
      profilePicture: user?.profilePicture
      })).unwrap();
    }catch(err){
      // Rollback optimistic update on error
      dispatch(optimisticLikeToggle({
      postId: post._id,
      userId: user?._id,
    }));
    console.error("Failed to toggle like:", err);
    }
  };

  useEffect(() => {
    // Close menu when clicking outSide
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dispatch]);

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-sm p-4 mb-6 backdrop-blur-xl transition-all duration-300
      ${isDark ? "bg-[#0b0f17]/80 border border-white/10 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)]" : "bg-white border border-gray-200 text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.user?.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          <div>
            <p className="font-semibold text-sm leading-none">
              {post.user?.firstName} {post.user?.lastName}
            </p>
            <p
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
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
            <FaEllipsisV size={16} />
          </button>
          {showMenu && (
            <div
              className={`absolute right-0 mt-2 w-36 rounded-xl overflow-hidden shadow-xl border backdrop-blur-xl z-50
            ${isDark ? "bg-[#0f1623]/95 border-white/10" : "bg-white border-gray-200"}`}
            >
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
                  dispatch(deletePost({ postId: post._id }));
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
        <p className="px-4 pt-3 text-sm leading-relaxed ">{post.caption}</p>
      )}

      {/* Content Section - Handle both text and image */}
      {post.content && post.contentType === "image" && (
        <div
          className={` mt-3${isDark ?"bg-black" :" bg-white"}`}
        >
          <img
            src={post.content.replace(/<[^>]*>/g, "").trim()}
            alt="post"
          className="w-full h-auto object-contain "
            loading="lazy"
            style={{ display: "block" }}
          />
        </div>
      )}
      {post.content && post.contentType === "text" && (
        <div
          className={`mt-3 text-sm leading-relaxed froala-content ${
            isDark ? "text-white" : "text-gray-800"
          }`}
          dangerouslySetInnerHTML={{ __html: post.content }} // HTML styling for the forala editior emojied
          style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
        />
      )}

      {/* Action Bar (ONLY if enabled from backend) */}
      <div className="flex items-center gap-8 mt-3 pt-3 border-t border-white/10">
        {!post.isLikeDisable && (
          <LikesSection 
            likes={likes}
            isLiked={isLiked}
            isLiking={isLiking}
            onLike={handleLike}
            isDark={isDark}
          />
        )}
        {/* isCommentDisable (not isCommentDisabled) */}
        {!post.isCommentDisable && (
          <div className="flex items-center gap-2 text-gray-400">
            <FaRegCommentDots size={18} />
            <span className="text-sm">{post.comments?.length || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
