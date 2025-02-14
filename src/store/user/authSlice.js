import { createSlice } from "@reduxjs/toolkit";
import { merge } from "lodash"; // For deep merging

// Load initial state from localStorage with error handling
let token = null;
try {
  token = JSON.parse(localStorage.getItem("token"));
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
  token = null;
}

const initialState = {
  token,
  isLoggedIn: !!token,
  userData: null,
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
      }
    },

    logout: (state) => {
      try {
        state.token = null;
        localStorage.removeItem("token");
        state.isLoggedIn = false;
        state.isAuthorLogin = false;
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
      const persistedToken = localStorage.getItem("token");
      const persistedUserData = localStorage.getItem("userData");

      if (action.payload?.auth) {
        state.token = action.payload.auth.token || persistedToken || null;
        state.isLoggedIn = !!state.token;
        state.userData =
          action.payload.auth.userData || JSON.parse(persistedUserData) || null;
        state.isAuthorLogin = action.payload.auth.isAuthorLogin || false;
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

// import { createSlice } from "@reduxjs/toolkit";
// //import { merge } from "lodash"; // For deep merging - NOT NEEDED NOW

// // Load initial state from localStorage with error handling
// let token = null;

// try {
//   token = JSON.parse(localStorage.getItem("token"));
// } catch (error) {
//   console.error("Error parsing token from localStorage:", error);
//   token = null;
// }
// let userData = null;
// try {
//   // Parse userData from localStorage
//   userData = JSON.parse(localStorage.getItem("userData"));
// } catch (error) {
//   console.error("Error parsing userData from localStorage:", error);
//   userData = null;
// }
// // Extract the userId from userData, if it exists
// const userId = userData ? userData.userId : null;
// // const initialState = {
// //   token,
// //   isLoggedIn: !!token,
// //   userData: userData || null,
// //   userId: userId, // Set userId from localStorage or null
// //   isAuthorLogin: false,
// //   isSidebarOpen: false,
// //   storyInfo: { name: null, id: null },
// //   error: null,
// // };
// const initialState = {
//   token,
//   isLoggedIn: !!token,
//   userData: userData, // Load userData from local storage
//   isAuthorLogin: false,
//   userId: localStorage.getItem("userId")
//     ? JSON.parse(localStorage.getItem("userId"))
//     : null, // Load userData from local storage,
//   isSidebarOpen: false,
//   storyInfo: { name: null, id: null },
//   error: null, // For error messages
// };

// console.log("Initial State:", initialState);

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // login: (state, action) => {
//     //   try {
//     //     state.token = action.payload.token;
//     //     localStorage.setItem("token", JSON.stringify(action.payload.token));
//     //     state.isLoggedIn = true;
//     //     state.userData = action.payload;
//     //     localStorage.setItem("userData", JSON.stringify(action.payload));
//     //     console.log("Token saved:", action.payload.token);
//     //     console.log("UserData saved:", action.payload);
//     //     state.isAuthorLogin = action.payload.isAuthor === true; //  <----  CORRECTED LINE!
//     //   } catch (error) {
//     //     console.error("Failed to save data to localStorage:", error);
//     //   }
//     // },
//     login: (state, action) => {
//       try {
//         state.token = action.payload.token;
//         localStorage.setItem("token", JSON.stringify(action.payload.token));
//         state.isLoggedIn = true;
//         state.userData = action.payload; // Store the ENTIRE user object
//         localStorage.setItem("userData", JSON.stringify(action.payload));
//         state.userId = action.payload._id; // Assuming _id is the user ID in the response
//         localStorage.setItem("userId", JSON.stringify(action.payload._id)); // Assuming _id is the user ID in the response
//         console.log("Token saved:", action.payload.token);
//         console.log("UserData saved:", action.payload);
//         state.isAuthorLogin = action.payload.isAuthor === true; //  <----  CORRECTED LINE!
//       } catch (error) {
//         console.error("Failed to save data to localStorage:", error);
//       }
//     },
//     logout: (state) => {
//       try {
//         state.token = null;
//         localStorage.removeItem("token");
//         state.userData = null; // Also clear userData on logout
//         localStorage.removeItem("userData");
//         state.isLoggedIn = false;
//         state.isAuthorLogin = false;
//       } catch (error) {
//         console.error("Failed to remove data from localStorage:", error);
//       }
//     },
//     setUserProfile: (state, action) => {
//       state.userData = action.payload;
//     },

//     updateUserProfile: (state, action) => {
//       try {
//         // Directly update profileData properties within userData using object spread
//         if (state.userData && state.userData.profileData) {
//           state.userData = {
//             ...state.userData,
//             profileData: {
//               ...state.userData.profileData,
//               ...action.payload, // Directly use the payload for the new values
//             },
//           };
//           localStorage.setItem("userData", JSON.stringify(state.userData)); // Update local storage
//         } else {
//           console.warn("userData or profileData is missing in the state.");
//         }
//       } catch (error) {
//         console.error("Error updating user profile:", error);
//       }
//     },
//     updateAuthorProfile: (state, action) => {
//       if (state.userData && state.userData.authorData) {
//         // Directly update properties within authorData using object spread
//         state.userData.authorData = {
//           ...state.userData.authorData,
//           ...action.payload, // payload should contain { first_name, last_name, pen_name }
//         };
//       }
//     },
//     toggleLanguageSelection: (state, action) => {
//       const languageId = action.payload;
//       const index = state.userData.languages.indexOf(languageId);
//       if (index === -1) {
//         state.userData.languages.push(languageId);
//       } else {
//         state.userData.languages.splice(index, 1);
//       }
//     },
//     toggleSidebar: (state) => {
//       state.isSidebarOpen = !state.isSidebarOpen;
//     },
//     setStoryInfo: (state, action) => {
//       state.storyInfo.id = action.payload.s_id;
//       state.storyInfo.name = action.payload.s_name;
//     },
//     updateSpotifyToken: (state, action) => {
//       state.spotifyToken = action.payload.spotifyToken.access_token;
//     },
//     setError: (state, action) => {
//       state.error = action.payload; // To show errors to the user
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase("persist/REHYDRATE", (state, action) => {
//       const persistedToken = localStorage.getItem("token");
//       const persistedUserData = localStorage.getItem("userData");

//       if (action.payload?.auth) {
//         state.token = action.payload.auth.token || persistedToken || null;
//         state.isLoggedIn = !!state.token;
//         state.userData =
//           action.payload.auth.userData || JSON.parse(persistedUserData) || null;
//         state.isAuthorLogin = action.payload.auth.isAuthorLogin || false;
//       }
//     });
//   },
// });

// export const {
//   login,
//   logout,
//   setUserProfile,
//   updateUserProfile,
//   toggleLanguageSelection,
//   toggleSidebar,
//   setStoryInfo,
//   updateSpotifyToken,
//   updateAuthorProfile,
//   setError,
// } = authSlice.actions;

// export default authSlice.reducer;
