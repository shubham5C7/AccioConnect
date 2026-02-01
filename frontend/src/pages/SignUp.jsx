import DynamicForm from "../Components/DynamicForm";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {IMAGES,getToastOptions,SCHEMAS} from '../constants'
import { useState } from "react";

const SignUp = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const navigate = useNavigate();
  const [imgLoading,setImgLoading] = useState(true);

  const handleSignUp = async (formData) => {
    console.log("SIGN UP DATA", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/signUp",
        data,{ withCredentials: true });
    
      console.log("RESPONSE", response);
      
      // if SignUp is Successful
      if (response.data.success) {
        const user = response.data.data.data;
        if (user.firstName && user.lastName) {
          const name = `${user.firstName} ${user.lastName}`;
          localStorage.setItem("name", name);
          console.log(name);
        }
        if (user.profilePicture) {
          localStorage.setItem("profilePicture", user.profilePicture);
          console.log(user.profilePicture);
        }
        // Show success toast
        toast.success("Account created successfully! Redirecting to sign in...");
        // Navigate after brief delay
        setTimeout(() => navigate("/signIn"), 1000);

      } else {
        // Show error toast
        toast.error(response.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("SIGNUP ERROR", err);
      // Show error toast for network/server errors
      toast.error(
        err.response?.data?.message || 
        err.message || 
        "An error occurred during signup"
      );
    }
  };
  return (
    <div className={`min-h-screen mt-10 flex items-center justify-center px-4 relative  ${isDark ? "bg-gray-800 text-white": "bg-white text-gray-900" }`}>
      {/* Add Toaster component */}
      <Toaster 
        theme={isDark ? 'dark' : 'light'}position="top-center" toastOptions={getToastOptions(isDark)}/>
         <div className='hidden lg:block absolute top-15 left-35 '>
          {imgLoading && (
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin absolute top-1/2 left-40"></div>
          )}
        <img 
          src={isDark ? IMAGES.signup.dark  : IMAGES.signup.light}
          alt="Sign Up Illustration"
          loading="lazy" // defer loading
          decoding="async" // non-blocking decode
          onLoad={()=>setImgLoading(false)}
          onError={(e) => (e.currentTarget.src = "/image-fallback.png")}
          className={`w-130 h-130  object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0":"opacity-100"}`}
        />
      </div>
      <div className="w-full max-w-lg lg:absolute lg:right-35">
        <DynamicForm
          schema={SCHEMAS.SIGN_UP}
          onSubmit={handleSignUp}
        />
      </div>
    </div>
  );
};

export default SignUp;