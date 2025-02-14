// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
// import store, { persistor } from "./store/store.js"; // Import store and persistor
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ProfilePage from "./pages/ProfilePage";
// import RootLayout from "./components/RootLayout";
// import ProtectedRoutes from "./components/ProtectedRoutes";
// import AboutSection from "./components/AboutSection";
// import CategoriesPage from "./pages/CategoriesPage";
// import AuthorsPage from "./pages/AuthorsPage";
// import LibraryPage from "./pages/LibraryPage";
// import AuthorStoriesPage from "./pages/AuthorStoriesPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import EmailVerifyPage from "./pages/EmailVerifyPage";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CategoryAudiobooksPage from "./pages/CategoryAudiobooksPage"; // Import the new component
// // import "./index.css";
// // import "./App.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <RootLayout />,
//     children: [
//       { index: true, element: <LoginPage />, errorElement: <h1>Error!</h1> },
//       { path: "/login", element: <LoginPage /> },
//       { path: "/register", element: <RegisterPage /> },
//       { path: "/forgotpassword", element: <ForgotPasswordPage /> },
//       { path: "/resetpassword/:token", element: <ResetPasswordPage /> },
//       { path: "/verifyEmail/:verifyToken", element: <EmailVerifyPage /> },
//       {
//         element: <ProtectedRoutes />,
//         children: [
//           { path: "/home", element: <HomePage /> },
//           { path: "/profile/user", element: <ProfilePage isAuthor={false} /> },
//           { path: "/profile/author", element: <ProfilePage isAuthor={true} /> },
//           { path: "/categories", element: <CategoriesPage /> },
//           // New Route
//           { path: "/category/:category", element: <CategoryAudiobooksPage /> },
//           { path: "/about", element: <AboutSection /> },
//           { path: "/library", element: <LibraryPage /> },
//           { path: "/authors", element: <AuthorsPage /> },
//           { path: "/authors/:authorId", element: <AuthorStoriesPage /> },
//         ],
//       },
//     ],
//   },
// ]);

// function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
//         <RouterProvider router={router} />
//       </PersistGate>
//       <ToastContainer />
//     </Provider>
//   );
// }

// export default App;
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import store, { persistor } from "./store/store.js"; // Import store and persistor
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RootLayout from "./components/RootLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AboutSection from "./components/AboutSection";
import CategoriesPage from "./pages/CategoriesPage";
import AuthorsPage from "./pages/AuthorsPage";
import LibraryPage from "./pages/LibraryPage";
import AuthorStoriesPage from "./pages/AuthorStoriesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryAudiobooksPage from "./pages/CategoryAudiobooksPage"; // Import the new component
import BestSellers from "./components/user/BestSellers.jsx"; // Import the BestSellers component
import NotFoundPage from "./pages/404Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />, // Add the NotFoundPage component as the errorElement
    children: [
      { index: true, element: <LoginPage />, errorElement: <h1>Error!</h1> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgotpassword", element: <ForgotPasswordPage /> },
      { path: "/resetpassword/:token", element: <ResetPasswordPage /> },
      { path: "/verifyEmail/:verifyToken", element: <EmailVerifyPage /> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/profile/user", element: <ProfilePage isAuthor={false} /> },
          { path: "/profile/author", element: <ProfilePage isAuthor={true} /> },
          { path: "/categories", element: <CategoriesPage /> },
          { path: "/category/:category", element: <CategoryAudiobooksPage /> },
          { path: "/about", element: <AboutSection /> },
          { path: "/library", element: <LibraryPage /> },
          { path: "/authors", element: <AuthorsPage /> },
          { path: "/authors/:authorId", element: <AuthorStoriesPage /> },
          // Add the BestSellers route
          { path: "/bestsellers", element: <BestSellers /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
}

export default App;
