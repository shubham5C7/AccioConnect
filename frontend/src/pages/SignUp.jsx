import DynamicForm from "../Components/DynamicForm";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {IMAGES,getToastOptions,SCHEMAS} from '../constants'
import { useState } from "react";
import uploadToS3 from "../utils/uploadToS3";

const SignUp = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const navigate = useNavigate();
  const [imgLoading,setImgLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Avoide double subitting(double click protection)

const handleSignUp = async (formData) => {

  if (isSubmitting) return;
  setIsSubmitting(true);

  try {

    const profilePictureFile = formData.get("profilePicture");

    // Convert early
    const dataToSend = Object.fromEntries(formData.entries());
    delete dataToSend.profilePicture;

    // Upload if file exists
    if (profilePictureFile instanceof File) {

      toast.loading("Uploading profile picture...", { id: "upload" });

      const uploadedImage = await uploadToS3(profilePictureFile);

      toast.success("Profile picture uploaded!", { id: "upload" });
      dataToSend.profilePicture = uploadedImage.permanentUrl;
      dataToSend.profilePictureKey = uploadedImage.key;
    }

    // Send signup request
    const response = await axios.post(
       "http://localhost:3000/auth/signUp",
      dataToSend,
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/signIn"), 1000);
    }

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Signup failed"
    );

  } finally {
    setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
export default SignUp;