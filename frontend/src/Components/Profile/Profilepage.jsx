import { useState } from "react";
import { useSelector } from "react-redux";

// ── your existing components ──────────────────────────────────────────
import ProfileTabs  from "./ProfileTabs";
import ProfileInfo  from "./ProfileInfo";
import PostsGrid    from "./PostsGrid";
import AboutCard    from "./AboutCard";
import MoreCard     from "./Morecard";
import LoginHistory from "./loginHistory/LoginHistory";

const ProfilePage = () => {
  const isDark  = useSelector((state) => state.theme.isDark);
  const posts   = useSelector((state) => state.posts.userPosts);
  const loading = useSelector((state) => state.posts.loading);
  const user    = useSelector((state) => state.posts.user);

  // activeTab lives HERE — not inside ProfileTabs
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-4">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          <AboutCard />
          <MoreCard  />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* Profile card */}
          <div className={`rounded-2xl overflow-hidden mb-4 ${
            isDark ? "bg-gray-800 ring-1 ring-gray-700" : "bg-white ring-1 ring-gray-200"
          }`}>

            {/* Cover */}
            <div className={`h-28 w-full ${
              isDark
                ? "bg-gradient-to-r from-gray-700 to-gray-600"
                : "bg-gradient-to-r from-blue-100 to-indigo-100"
            }`} />

            {/* Avatar */}
            <div className="px-5 -mt-10">
              <img
                src={user?.profilePicture}
                alt={user?.firstName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
              />
            </div>

            {/* Name + buttons (your existing ProfileInfo) */}
            <ProfileInfo />

            {/*  pass both props — ProfileTabs no longer owns state */}
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* ── Tab content ── */}
          <div>
            {activeTab === "Posts"        && <PostsGrid posts={posts} loading={loading} />}
            {activeTab === "About"        && <AboutCard />}
            {activeTab === "LoginHistory" && <LoginHistory />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;