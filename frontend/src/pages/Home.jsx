import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "../Components/SideBar";
import RightPanel from "../Components/RecentlyPlaced";
import PostCard from "../Components/PostCard";
import { IoChatbubblesOutline } from "react-icons/io5";
import { fetchAllPosts, profilePost } from "../features/postsSlice";
import { Colors } from "../constants";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    posts = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.posts || {});

  useEffect(() => {
    dispatch(profilePost());
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div
      className={`flex h-screen w-full overflow-hidden p-3 gap-6 ${isDark ? "text-white" : "bg-gray-100 text-gray-900"}`}
      style={isDark ? { background: Colors.HomeBG } : {}}
    >
      {/* Sidebar  */}
      <div className="w-72 shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <SideBar />
      </div>

      {/* Center feed */}
      <div className=" w-full max-w-2xl flex-1 overflow-y-auto pt-12 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading posts...</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No posts yet. Be the first to post!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            {posts.map((post) => (
              <PostCard key={post._id || Math.random()} post={post} />
            ))}
          </>
        )}
      </div>

      {/* Right panel  */}
      <div className=" shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <RightPanel />
      </div>

      <div className="fixed bottom-6 right-10">
        {/* Outer ping ring */}
        <span className={`absolute -inset-4 rounded-full animate-ping opacity-20
          ${isDark ? "bg-blue-500" : "bg-gray-800"}`}
        ></span>

        {/* Inner ping ring */}
        <span className={`absolute -inset-2 rounded-full animate-ping opacity-35
          ${isDark ? "bg-blue-400" : "bg-gray-900"}`}
          style={{ animationDelay: "0.5s" }}
        ></span>

        {/* Button */}
        <div 
          onClick={() => navigate("/chat")}
          className={`h-13 w-13 rounded-full flex justify-center items-center cursor-pointer relative z-10 transition border
            ${isDark 
              ? "bg-gray-800 border-gray-700 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
              : "bg-white border-blue-300 text-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.35),0_4px_15px_rgba(0,0,0,0.12)]"
            }`}
        >
          <IoChatbubblesOutline size={28} />
        </div>
      </div>
    </div>
  );
};

export default Home;