import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { timeAgo } from "../constants";

const LikesSection = ({ 
  likes = [], 
  isLiked, 
  isLiking, 
  onLike, 
  isDark 
}) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const modalRef = useRef();
  const buttonRef = useRef();

  // Get user initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get first 3 likes for preview
  const previewLikes = likes.slice(0, 3);

  // Close modal when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowLikesModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={isLiking}
        className={`transition ${
          isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
        } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLiked ? (
          <FaHeart size={20} className="fill-current" />
        ) : (
          <FaRegHeart size={20} />
        )}
      </button>

      {/* Stacked Profile Pictures + Count */}
      {likes.length > 0 && (
        <div 
          ref={buttonRef}
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setShowLikesModal(!showLikesModal)}
        >
          {/* Stacked Avatars */}
          <div className="flex items-center -space-x-2">
            {previewLikes.map((like, index) => (
              <div key={like._id || index}>
                {like.profilePic ? (
                  <img
                    src={like.profilePic}
                    alt={like.userName}
                    className={`w-6 h-6 rounded-full object-cover border-2 transition-transform group-hover:scale-110 ${
                      isDark ? "border-[#0b0f17]" : "border-white"
                    }`}
                    style={{ zIndex: previewLikes.length - index }}
                  />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-transform group-hover:scale-110 ${
                      isDark 
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-[#0b0f17] text-white" 
                        : "bg-gradient-to-br from-blue-400 to-purple-500 border-white text-white"
                    }`}
                    style={{ zIndex: previewLikes.length - index }}
                  >
                    {getInitials(like.userName)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Count Text */}
          <span className={`text-sm font-medium group-hover:underline ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            {likes.length === 1 
              ? "1 like"
              : `${likes.length} likes`
            }
          </span>
        </div>
      )}

      {/* Small Compact Modal (Instagram/LinkedIn style) */}
      {showLikesModal && likes.length > 0 && (
        <div
          ref={modalRef}
          className={`absolute bottom-full left-0 mb-2 w-72 rounded-xl shadow-2xl border max-h-80 flex flex-col z-50 ${
            isDark 
              ? "bg-[#1a1f2e] border-gray-700" 
              : "bg-white border-gray-200"
          }`}
        >
          {/* Compact Header */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <h3 className="text-sm font-bold">Liked by</h3>
            <button
              onClick={() => setShowLikesModal(false)}
              className={`p-1 rounded-full transition ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <FaTimes size={12} className="text-gray-500" />
            </button>
          </div>

          {/* Compact List */}
          <div className="overflow-y-auto flex-1 p-2">
            <div className="space-y-0.5">
              {likes.map((like, index) => (
                <div
                  key={like._id || index}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition ${
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Profile Picture or Initials */}
                  {like.profilePic ? (
                    <img
                      src={like.profilePic}
                      alt={like.userName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      isDark 
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                        : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                    }`}>
                      {getInitials(like.userName)}
                    </div>
                  )}
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">
                      {like.userName}
                    </p>
                    {like.likedAt && (
                      <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {timeAgo(like.likedAt)}
                      </p>
                    )}
                  </div>
                  
                  {/* Small Heart Icon */}
                  <FaHeart className="text-red-500 flex-shrink-0" size={11} />
                </div>
              ))}
            </div>
          </div>

          {/* Small Arrow pointing down */}
          <div 
            className={`absolute -bottom-2 left-6 w-4 h-4 rotate-45 ${
              isDark ? "bg-[#1a1f2e] border-b border-r border-gray-700" : "bg-white border-b border-r border-gray-200"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default LikesSection;