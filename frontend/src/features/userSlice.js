import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserFromStorage, clearUserFromStorage, saveUserToStorage } from "../utils/storage";

const AUTH_API = "http://localhost:3000/auth";
const USER_API = "http://localhost:3000/user";

// SIGNUP
export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${AUTH_API}/signUp`, formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "SignUp Failed");
    }
  }
);

// SIGNIN
export const signInUser = createAsyncThunk(
  "auth/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${AUTH_API}/signIn`, formData, {
        withCredentials: true,
      });
      const user = res.data.data.user;
      saveUserToStorage(user); // ← add this
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "SignIn Failed");
    }
  }
);

// LOGOUT
export const logOutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${AUTH_API}/logout`, {}, { withCredentials: true });
      clearUserFromStorage(); 
      return true;
    } catch (err) {
      return rejectWithValue("Logout Failed");
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${USER_API}/updateprofile`, formData, {
        withCredentials: true,
      });
      return res.data.data; // updated user
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile Update Failed");
    }
  }
);

export const fetchLoginHistory = createAsyncThunk(
  "user/fetchLoginHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${AUTH_API}/history`, { 
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);


const userSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: getUserFromStorage() || null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNIN
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(logOutUser.rejected, (state) => {
        state.loading = false;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;