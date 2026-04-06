import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profilePost, fetchUserPosts } from "../features/postsSlice";

import MoreCard from "../Components/Profile/Morecard";
import AboutCard from "../Components/Profile/AboutCard";
import PostsGrid from "../Components/Profile/PostsGrid";
import CoverPhoto from "../Components/Profile/CoverPhoto";
import ProfileInfo from "../Components/Profile/ProfileInfo";
import ProfileTabs from "../Components/Profile/ProfileTabs";
import SideBar from "../Components/Profile/SideBar";
import EditProfileModal from "../Components/Profile/EditProfileModal";
import LoginHistory from "../Components/Profile/loginHistory/LoginHistory";

const Profile = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const { userPosts, loading, user } = useSelector((state) => state.posts);

  const [activeTab, setActiveTab] = useState("Posts");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const profileRes = await dispatch(profilePost());
      if (profileRes.payload?._id) {
        await dispatch(fetchUserPosts(profileRes.payload._id));
      }
    };
    fetchProfileAndPosts();
  }, [dispatch]);

  const refreshUser = () => {
    dispatch(profilePost());
  };

  return (
    <div
      className={`flex min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* LEFT SIDEBAR */}
      <SideBar />

      {/* MAIN CONTENT */}
      <div className="flex-1">
<div className="max-w-6xl mx-auto px-4 py-6 mt-10">
  <div className="flex flex-col lg:flex-row gap-5">

    {/* PROFILE SECTION */}
    <div className="flex-1">
      <div
        className={`rounded-2xl shadow ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CoverPhoto />

        <div className="mt-10 sm:mt-16 pb-4">
          <ProfileInfo />
        </div>

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "Posts" && (
          <PostsGrid posts={userPosts || []} loading={loading} />
        )}
        {activeTab === "About" && (
          <AboutCard openEditModal={() => setShowModal(true)} />
        )}
        {activeTab === "LoginHistory" && ( 
        <LoginHistory />
      )}
      </div>
    </div>

    {/* RIGHT SIDE PANEL */}
    <div className="w-full lg:w-60 shrink-0 flex flex-col gap-4">
      <AboutCard openEditModal={() => setShowModal(true)} />
      <MoreCard />
    </div>

  </div>
</div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showModal && (
        <EditProfileModal
          user={user}
          closeModal={() => setShowModal(false)}
          refreshUser={refreshUser}
        />
      )}
    </div>
  );
};

export default Profile;