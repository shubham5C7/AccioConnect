import DynamicForm from "../Components/DynamicForm";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { IMAGES, getToastOptions, SCHEMAS } from '../constants';
import { useState } from "react";
import uploadToS3 from "../utils/uploadToS3";
import { signUpUser } from "../features/userSlice";

const SignUp = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imgLoading, setImgLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Single toast ID covers the entire flow: loading → success/error
    toast.loading("Creating your account...", { id: "signup" });

    try {
      const profilePictureFile = formData.get("profilePicture");

      // Safe conversion — handles multi-value keys (checkboxes, multi-selects)
      const dataToSend = {};
      formData.forEach((value, key) => {
        if (key === "profilePicture") return;
        dataToSend[key] = dataToSend[key]
          ? [].concat(dataToSend[key], value)
          : value;
      });

      // Upload profile picture if provided
      if (profilePictureFile instanceof File) {
        const uploadedImage = await uploadToS3(profilePictureFile);

        // Guard against unexpected S3 response shape
        if (!uploadedImage?.permanentUrl || !uploadedImage?.key) {
          throw new Error("Image upload returned an invalid response");
        }

        dataToSend.profilePicture = uploadedImage.permanentUrl;
        dataToSend.profilePictureKey = uploadedImage.key;
      }

      // Use Redux thunk instead of raw axios — keeps state.auth.loading in sync
      const result = await dispatch(signUpUser(dataToSend));

      if (signUpUser.fulfilled.match(result)) {
        toast.success("Account created! Redirecting...", { id: "signup" });
        setTimeout(() => navigate("/signIn"), 1000);
      } else {
        throw new Error(result.payload || "Signup failed");
      }

    } catch (err) {
      toast.error(err.message || "Signup failed", { id: "signup" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen mt-10 flex items-center justify-center px-4 relative ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <Toaster
        theme={isDark ? 'dark' : 'light'}
        position="top-center"
        toastOptions={getToastOptions(isDark)}
      />

      <div className='hidden lg:block absolute top-15 left-35'>
        {imgLoading && (
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin absolute top-1/2 left-40"></div>
        )}
        <img
          src={isDark ? IMAGES.signup.dark : IMAGES.signup.light}
          alt="Sign Up Illustration"
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoading(false)}
          onError={(e) => (e.currentTarget.src = "/image-fallback.png")}
          className={`w-130 h-130 object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0" : "opacity-100"}`}
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