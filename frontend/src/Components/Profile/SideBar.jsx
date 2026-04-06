import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { logOutUser } from '../../features/userSlice';
import { IoHome } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = useSelector((state)=>state.theme.isDark)

  const handleLogOut =async()=>{
  await dispatch(logOutUser());
   navigate("/signIn")
  }
  return (
 <div
      className={`
        hidden lg:flex
        fixed top-0 left-0
        w-16 h-screen
        flex-col justify-between items-center
        p-4 border-r shadow-2xl
        ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* HOME */}
      <button
        onClick={() => navigate("/")}
        className={`p-3 mt-12 rounded-xl transition-all duration-200
        ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
      >
        <IoHome size={24} />
      </button>

      {/* LOGOUT */}
      <button
        onClick={handleLogOut}
        className={`p-3 rounded-xl transition-all duration-200
        ${isDark ? "hover:bg-red-400" : "hover:bg-red-600"} hover:text-white`}
      >
        <CgLogOut size={26} />
      </button>
    </div>
  )
}

export default SideBar