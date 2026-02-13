import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { Toaster, toast } from 'sonner'
import { setUser } from '../features/userSlice'; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {IMAGES,getToastOptions} from '../constants'
import {saveUserToStorage} from '../utils/storage'

const SignIn = () => {
  const [showPasswod,setShowPassword]=useState(false);
  const isDark = useSelector((state) => state.theme.isDark)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoading,setImgLoading]=useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, [name]: value
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/signIn",
        formData, {withCredentials: true, }
      );

      if (response.data?.success) {
        // Save user to Redux
       const userData = response.data.data.user; 
        console.log("User Data received:", userData);
        dispatch(setUser(userData));
        console.log("User Data received:", userData);

        // Sav ethe data in localStorage
        saveUserToStorage(userData)
        // Show success toast
        toast.success('Welcome back! Signed in successfully!');
        // Navigate after a brief moment
        setTimeout(() => navigate("/"), 800);
      } else {
        // Show error toast
        toast.error("Sign in failed ! Try Again");
      }
    } catch (error) {
      console.error(error);
      // Show error toast for network/server errors
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "An error occurred during sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-start lg:block overflow-hidden ${isDark? "bg-gray-800  text-white ring-1 ring-gray-100/10": "bg-white text-gray-900 ring-1 ring-gray-900/5" }`}>
      {/* Add Toaster component */}
      <Toaster 
        theme={isDark ? 'dark' : 'light'}
        position="top-center"
        toastOptions={getToastOptions(isDark)}
      />
      <div className="w-full max-w-md mx-auto px-4 pt-3 lg:absolute lg:top-30 lg:left-55">
        <div className={`p-8 rounded-2xl shadow-3xl ${isDark ? "bg-gray-800 text-white ring-1 ring-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.7)]": "bg-white text-gray-900 ring-1 ring-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.15)]"  }`}>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2"> Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-blue-500'  : 'bg-white border-gray-300 focus:border-blue-500' } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Enter your email"
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-2">  Password</label>
              <input
                type={showPasswod ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 pr-12 rounded-md border ${isDark ? 'bg-gray-800 border-gray-700 focus:border-blue-500'  : 'bg-white border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter your password"
                  />  
              <button
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                className={`absolute right-3 bottom-2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700' }`}>
                {showPasswod ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-500 hover:text-blue-600">
                Forgot Password?
              </Link>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${ isDark? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white' } disabled:opacity-50 disabled:cursor-not-allowed`}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
             <div className="mt-6 text-center">
             <p className="text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-500 hover:text-blue-600 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
          </form>
        </div>
      </div>

      <div className='hidden lg:block absolute top-18 right-38'>
       {imgLoading && (
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin absolute top-50 left-40"></div>
       )}
        <img 
          src={isDark ? IMAGES.signin.dark :  IMAGES.signin.light}
          alt="Sign In Illustration"
          loading='lazy'
          decoding='async'
          onLoad={()=>setImgLoading(false)}
          onError={(e)=>(e.currentTarget.src = "/image-fallback.png")}
           className={`w-130 h-130 object-cover transition-opacity duration-500 ${imgLoading ? "opacity-0":"opacity-100"}`}
        />
      </div>
    </div>
  )
}

export default SignIn