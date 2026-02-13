  import axios from 'axios'
  import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

  const API ="http://localhost:3000/posts"; 

  // Fetch a API for getting all posts
  export const fetchAllPosts = createAsyncThunk("posts/allPosts",
    async(_, {rejectWithValue})=>{
      try{
        const response = await axios.get(`${API}/allposts`,{
          withCredentials:true// Send to Cookies 
        })
        return response.data.data;
      }catch(err){
         console.error('API Error:', err);
        return rejectWithValue(err.response?.data?.message || "Failed to fetch posts");
      }
    }
  )

  // Fetch an API for Create Post
  export const createPost = createAsyncThunk("posts/createPost",
    async(postData,{rejectWithValue})=>{
       try{
        const payload = {
        content: postData.content.trim(),
        caption: postData.caption.trim() || "",
        type: postData.type || "general-post",
        contentType: postData.contentType || "text",
        isCommentDisable: !postData.commentsEnabled,
        isLikeDisable: !postData.likesEnabled,
        };
        console.log("Payload being sent to backend:", payload); // ADD THIS
        const response = await axios.post(`${API}/createpost`,payload,{withCredentials:true});
          console.log(" Backend response:", response.data); // ADD THIS
         // Handle different response structures
      return response.data.data;  ;
       }catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create post");
    }
    }
  )

  // Fetch Api for the toggle the LIkes and UnLikes
  export const toggleLikes = createAsyncThunk("posts/toggleLikes",
    async({postId, userId, userName, profilePicture},{rejectWithValue})=>{
      try{
        const response = await axios.patch(`${API}/likes/${postId}`,{
          userId,
          userName,
           profilePicture
        },{
        withCredentials:true
        })
              console.log("Like response received:", response.data);
      return response.data.data;
      }catch(err){
              console.error("Like API error:", err.response?.data); 
        return rejectWithValue(err.response?.data?.message ||  "Failed to toggle like");
      }
    }
  )

  // Fetch API fpr the add Commments
  export const addComments = createAsyncThunk("posts/addComments",
    async({postId,commentText},{rejectWithValue})=>{
      try{
        const response = await axios.patch(`${API}/comments/${postId}`,
          { text: commentText }, // Send comment data
          {withCredentials:true})
        return response.data.data;
      }catch(err){
        return rejectWithValue(err.response?.data?.message ||"Failed to add comment");
      }
    }
  )

  // Fetch API for the Delete the post
  export const deletePost = createAsyncThunk("posts/deletePost",
    async({postId},{rejectWithValue})=>{
      console.log("Thunk called with postId:", postId);
      try{
        const response = await axios.delete(`${API}/deletePost/${postId}`,{
        withCredentials:true
        })
         console.log("Delete API response:", response.data); 
          return postId; // Return postId for filtering
      }catch(err){
          console.error("Delete API error:", err.response?.data || err);
              return rejectWithValue(err.response?.data?.message || "Failed to delete post");
      }
    }
  )

// Fetch API for the Profile of the user
export const profilePost = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/user/profile",
        { withCredentials: true }
      );

      console.log(response.data.data, "profile");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

  const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
     user: null,      
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
     likesLoading: {},
    commentsLoading: false,
  },

  reducers: {
    addPosts: (state, action) => {
      state.posts.unshift(action.payload);
    },

    clearCreateError: (state) => {
      state.createError = null;
    },
    optimisticLikeToggle:(state,action) => {
      const {postId,userId} = action.payload;

      const post = state.posts.find((p)=>p._id === postId);
      if(!post) return;

        if (!post.likes) {
        post.likes = [];
         }


      const alreadyLiked = post.likes?.some((like) => like.userId === userId);

      if(alreadyLiked){
        post.likes = post.likes.filter((like) => like.userId !== userId);
      }else{
        post.likes.push({userId});
      }
    }
  },

  extraReducers: (builder) => {
    builder
      /*  FETCH POSTS  */
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
         state.posts = action.payload || [];
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*  CREATE POST  */
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      /*  TOGGLE LIKE  */
      .addCase(toggleLikes.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        state.likesLoading[postId] = true;
      })
    .addCase(toggleLikes.fulfilled, (state, action) => {
      const postId = action.payload._id;
      state.likesLoading[postId] = false;
      const index = state.posts.findIndex((p) => p._id === postId);

      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    })
    .addCase(toggleLikes.rejected, (state, action) => {
      const postId = action.meta.arg.postId;
      state.likesLoading[postId] = false;
      state.error = action.payload;
    })

      /*  ADD COMMENT  */
      .addCase(addComments.pending, (state) => {
        state.commentsLoading = true;
      })
      .addCase(addComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(addComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.error = action.payload;
      })

      /* DELETE POST  */
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profile user
      .addCase(profilePost.pending,(state)=>{
        state.loading=true;
         state.error = null;
      })
      .addCase(profilePost.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(profilePost.rejected, (state, action) => {
        state.loading = false;
       state.error = action.payload;
      });
  },
});

export const { addPosts, clearCreateError, optimisticLikeToggle } = postsSlice.actions;
export default postsSlice.reducer;