// // store.js
// import { configureStore } from "@reduxjs/toolkit";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import { apiSlice } from "./apiSlice"; // Your API slice
// import authReducer from "./user/authSlice"; // Your auth slice
// import { spotifyRootApiSlice } from "./spotify/spotifyRootApiSlice";

// const persistConfig = {
//   key: "auth", // Key for localStorage
//   storage,
//   whitelist: ["auth"], // Only persist the auth slice
//   // Do NOT persist apiSlice or spotifyRootApiSlice
// };

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     [spotifyRootApiSlice.reducerPath]: spotifyRootApiSlice.reducer, // DO NOT PERSIST THIS!
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(apiSlice.middleware, spotifyRootApiSlice.middleware),
//   devTools: true,
// });

// export const persistor = persistStore(store);

// export default store;
// store.js (Corrected)
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./apiSlice";
import authReducer from "./user/authSlice";
import { spotifyRootApiSlice } from "./spotify/spotifyRootApiSlice";

// const persistConfig = {
//   key: "auth",
//   storage,
//   whitelist: ["userData", "isLoggedIn", "isAuthorLogin"], // Whitelist state keys!
// };
const persistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "token",
    "isLoggedIn",
    "isAuthorLogin",
    "userData",
    "profileData",
  ], // Whitelist state keys!
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [spotifyRootApiSlice.reducerPath]: spotifyRootApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, spotifyRootApiSlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;
