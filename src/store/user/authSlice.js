import { createSlice } from "@reduxjs/toolkit";
import { merge } from "lodash"; // For deep merging

// Load initial state from localStorage with error handling
let token = null;
try {
  const storedToken = localStorage.getItem("token");
  console.log(storedToken);
  if (storedToken) {
    token = JSON.parse(storedToken);
    console.log("Token from localStorage:", token);
  }
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
  token = null;
}

let userData = null;
try {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    userData = JSON.parse(storedUserData);
    console.log("UserData from localStorage:", userData);
  }
} catch (error) {
  console.error("Error parsing userData from localStorage:", error);
  userData = null;
}

const initialState = {
  token,
  isLoggedIn: !!token,
  userData,
  isAuthorLogin: false,
  isSidebarOpen: false,
  storyInfo: { name: null, id: null },
  error: null, // For error messages
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      try {
        state.token = action.payload.token;
        localStorage.setItem("token", JSON.stringify(action.payload.token));
        state.isLoggedIn = true;
        state.userData = action.payload;
        localStorage.setItem("userData", JSON.stringify(action.payload));
        console.log("Token saved:", action.payload.token);
        console.log("UserData saved:", action.payload);
        state.isAuthorLogin = action.payload.isAuthor === true; //  <----  CORRECTED LINE!
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
        state.error = "Failed to save data to localStorage"; // Set an error message
      }
    },

    logout: (state) => {
      try {
        state.token = null;
        localStorage.removeItem("token");
        state.isLoggedIn = false;
        state.isAuthorLogin = false;
        localStorage.removeItem("userData"); // Clear userdata too
      } catch (error) {
        console.error("Failed to remove data from localStorage:", error);
      }
    },
    setUserProfile: (state, action) => {
      state.userData = action.payload;
    },

    updateUserProfile: (state, action) => {
      if (state.userData && state.userData.profileData) {
        // Directly update properties within profileData using object spread
        state.userData.profileData = {
          ...state.userData.profileData,
          ...action.payload, // payload should contain { first_name, last_name }
        };
      }
    },
    updateAuthorProfile: (state, action) => {
      if (state.userData && state.userData.authorData) {
        // Directly update properties within authorData using object spread
        state.userData.authorData = {
          ...state.userData.authorData,
          ...action.payload, // payload should contain { first_name, last_name, pen_name }
        };
      }
    },
    toggleLanguageSelection: (state, action) => {
      const languageId = action.payload;
      const index = state.userData.languages.indexOf(languageId);
      if (index === -1) {
        state.userData.languages.push(languageId);
      } else {
        state.userData.languages.splice(index, 1);
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
      state.error = action.payload; // To show errors to the user
    },
  },
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE", (state, action) => {
      if (action.payload?.auth) {
        try {
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            state.token = JSON.parse(storedToken);
            state.isLoggedIn = true;
          } else {
            state.token = null;
            state.isLoggedIn = false;
          }

          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            state.userData = JSON.parse(storedUserData);
          } else {
            state.userData = null;
          }

          state.isAuthorLogin = action.payload.auth.isAuthorLogin || false;
        } catch (error) {
          console.error("Error during rehydration:", error);
          // Handle the error appropriately, e.g., clear the token, set an error state
          state.token = null;
          state.isLoggedIn = false;
          state.userData = null;
          state.isAuthorLogin = false;
        }
      }
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
