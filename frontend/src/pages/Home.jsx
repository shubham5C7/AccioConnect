import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "../Components/SideBar";
import RightPanel from "../Components/RecentlyPlaced";
import PostCard from "../Components/PostCard";
import { fetchAllPosts } from "../features/postsSlice";
import {Colors} from '../constants'

const Home = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  //Safe destructuring with fallback to prevent "undefined.length" error
  const {
    posts = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.posts || {});
  // Fetch API for all the posts
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div
      className={`flex h-screen overflow-hidden p-8  ${isDark ? "text-white" : "bg-gray-100 text-gray-900"}`}
      style={isDark ? { background: Colors.HomeBG } : {}}>
      {/* Sidebar */}
      <div className="w-60 shrink-0">
        <SideBar />
      </div>

      {/* Center feed */}
      <div className="w-[660px] overflow-y-auto  px-4 ml-12 pt-8  [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
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
              <PostCard key={post._id} post={post} />
            ))}
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <RightPanel />
      </div>
    </div>
  );
};

export default Home;
