import { configureStore } from "@reduxjs/toolkit";
import themeReducer from '../features/themeSlice'
import userReducer from '../features/userSlice'; 
import postReducer from '../features/postsSlice'



// This reduces will manage all authenticational-related state
export const store = configureStore({
  reducer:{
     theme: themeReducer,
      user: userReducer, 
      posts : postReducer,
    
  }
})
export default store;