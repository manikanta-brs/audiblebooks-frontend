import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Import Axios or your preferred HTTP client

const initialState = {
  token: null,
  isLoggedIn: false,
  userData: null,
  isAuthorLogin: false,
  isSidebarOpen: false,
  storyInfo: { name: null, id: null },
  error: null,
  isLoading: true, // ADD THIS:  Initially true
};

//Async thunk to validate user and author tokens
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null; // No token found
      }
      const response = await axios.get("http://localhost:8000/api/v1/auth/me", {
        // Replace with your API endpoint
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        return {
          token: token,
          userData: response.data.data,
          isAuthor: response.data.data.role === "author", // Adjust based on your API response
        }; // Return the token and user data
      } else {
        localStorage.removeItem("authToken");
        return null;
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      return thunkAPI.rejectWithValue(error.message); // Reject with an error message
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.userData = action.payload;
      state.isAuthorLogin = action.payload.isAuthor === true;
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.isAuthorLogin = false;
      state.userData = null;
      localStorage.removeItem("authToken"); //remove token from localstorage also
    },
    setUserProfile: (state, action) => {
      state.userData = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.userData && state.userData.profileData) {
        state.userData = {
          ...state.userData, // Create a new userData object
          profileData: {
            ...state.userData.profileData, // Create a new profileData object
            ...action.payload, // Merge in the changes from the payload
          },
        };
      }
    },
    updateAuthorProfile: (state, action) => {
      if (state.userData && state.userData.profileData) {
        // Corrected this line: Use profileData instead of authorData
        state.userData = {
          ...state.userData, // Create a new userData object
          profileData: {
            // Corrected this line: Use profileData instead of authorData
            ...state.userData.profileData, // Create a new profileData object
            ...action.payload, // Merge in the changes from the payload
          },
        };
      }
    },
    toggleLanguageSelection: (state, action) => {
      const languageId = action.payload;
      const index = state.userData.languages.indexOf(languageId);
      if (index === -1) {
        // Immutable push:  Create a new array
        state.userData.languages = [...state.userData.languages, languageId];
      } else {
        // Immutable splice: Create a new array
        state.userData.languages = [
          ...state.userData.languages.slice(0, index),
          ...state.userData.languages.slice(index + 1),
        ];
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setStoryInfo: (state, action) => {
      state.storyInfo.id = action.payload.s_id;
      state.storyInfo.name = action.payload.s_name;
    },
    updateSpotifyToken: (state, action) => {
      state.spotifyToken = action.payload.spotifyToken.access_token;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.isLoggedIn = true;
          state.userData = action.payload.userData;
          state.isAuthorLogin = action.payload.isAuthor;
        } else {
          // No valid token found
          state.isLoggedIn = false;
          state.token = null;
          state.userData = null;
          state.isAuthorLogin = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.userData = null;
        state.isAuthorLogin = false;
        state.error = action.payload;
      });
  },
});

export const {
  login,
  logout,
  setUserProfile,
  updateUserProfile,
  toggleLanguageSelection,
  toggleSidebar,
  setStoryInfo,
  updateSpotifyToken,
  updateAuthorProfile,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
