import { useDispatch, useSelector } from "react-redux";
import { PiSun, PiMoon } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { toggleTheme } from "../features/themeSlice";
import SearchBar from "./SearchBar";
import {IMAGES,Colors} from '../constants'
import {getProfilePicture} from '../utils/storage'

const NavBar = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuth = location.pathname === "/signUp" || location.pathname === "/signIn";

    const profilePic = getProfilePicture();

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-14 px-6 flex items-center justify-between shadow-2xl z-50
        ${isDark ? " text-white ring-1 ring-gray-100/10" : "bg-white text-gray-900 ring-1 ring-gray-900/5"}
      `}
      style={isDark ? Colors.NavbarBG : {}}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center h-full overflow-hidden">
        <img
          src={
            isDark? IMAGES.NavBar.dark :IMAGES.NavBar.light }
           alt="AccioConnect"
          loading="lazy"
          decoding="async"
          onError={(e)=>(e.currentTarget.src = "/image-fallback.png")}
          className={`h-13 w-auto object-contain ${
            isDark ? "bg-gray-800 text-white ring-1 ring-gray-100/10" : "bg-white text-gray-900 ring-1 ring-gray-900/5"
          }`}
        />
      </Link>

      {/* Search Bar */}
      {!isAuth && <SearchBar />}


      {/* Theme Toggle Button */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className={`p-2 rounded-full transition cursor-pointer  absolute  ${
          isDark ? " text-gray-200 hover:bg-gray-600" : " text-gray-800 hover:bg-gray-200"
        }
        ${isAuth ?"right-5" : "right-19"}`}
        aria-label="Toggle theme"
      >
        {isDark ? <PiSun size={23} /> : <PiMoon size={23} />}
      </button>

  {!isAuth && (
      <Link to="/profile" className="w-10 h-10 bg-white  rounded-full ">
        <img 
        src={profilePic}
        alt="Profile"
        loading="lazy"
        decoding="async"
          onError={(e)=>(e.currentTarget.src = "/image-fallback.png")}
         className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
    )} 

    </nav>
  );
};

export default NavBar;
