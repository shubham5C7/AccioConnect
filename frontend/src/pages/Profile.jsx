import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {profilePost} from '../features/postsSlice'

const Profile = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state)=>state.theme.isDark);
  const { user, loading, error } = useSelector((state)=>state.posts);
  
  useEffect(() => {
    dispatch(profilePost());
  }, [dispatch]);
  
  console.log(user, "users");

  return (
   <div
      className={`w-full min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >

    </div>
  )
}

export default Profile