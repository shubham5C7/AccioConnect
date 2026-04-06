import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";
import { addComments } from "../features/postsSlice";
import { timeAgo } from "../constants";

const CommentSection = ({ post, isDark }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.posts.user);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        addComments({
          postId: post._id,
          commentText,
          userId: user?._id,
          userName: `${user?.firstName} ${user?.lastName}`,
          profilePicture: user?.profilePicture,
        }),
      ).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const comments = post.comments || [];

  return (
    <div
      className={`border-t mt-3 pt-3 ${isDark ? "border-white/10" : "border-gray-100"}`}
    >
      {/* existing comments list */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3 mb-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-2">
              <img
                src={comment.profilePic}
                alt={comment.userName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div
                className={`rounded-2xl px-3 py-2 text-sm max-w-[85%]
                ${isDark ? "bg-[#1a2030] text-white" : "bg-gray-100 text-gray-800"}`}
              >
                <p className="font-semibold text-xs mb-0.5">
                  {comment.user?.firstName} {comment.userName}
                </p>
                <p className="leading-relaxed">{comment.comment}</p>
              </div>
              {/* timestamp sits outside the bubble, just like FB */}
              <span
                className={`text-xs self-end mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {timeAgo(comment.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* comment input row */}
      <div className="flex items-center gap-3">
        <img
          src={user?.profilePicture}
          alt="me"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div
          className={`flex flex-1 items-center rounded-full px-4 py-2 gap-2
          ${isDark ? "bg-[#1a2030]" : "bg-gray-100"}`}
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type a comment..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim()}
            className="text-blue-500 hover:text-blue-400 disabled:opacity-40 transition"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
