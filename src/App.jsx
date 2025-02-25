import React, { useState, useRef, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store.js";
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
import CategoryAudiobooksPage from "./pages/CategoryAudiobooksPage";
import BestSellers from "./components/user/BestSellers.jsx";
import NotFoundPage from "./pages/404Error.jsx";
import SidebarPlayer from "./components/books/sidebar/SidebarAudioPlayer.jsx";
import { createPortal } from "react-dom"; // Import createPortal

const App = () => {
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const sidebarRoot = useRef(document.createElement("div")); // Create a ref for the sidebar root
  const [sidebarContainer, setSidebarContainer] = useState(null);

  useEffect(() => {
    sidebarRoot.current.setAttribute("id", "sidebar-root"); // Set an ID for styling purposes
    document.body.appendChild(sidebarRoot.current); // Append to the document body

    setSidebarContainer(sidebarRoot.current); // Set the state

    return () => {
      document.body.removeChild(sidebarRoot.current); // Cleanup on unmount
    };
  }, []);

  const handleBookSelect = (book) => {
    // console.log("Book selected:", book);
    // console.log(`%c inkenti mawa mari audio book vinu.... `, "color:#00ff00");
    setSelectedAudiobook(book);
  };

  const handleCloseSidebar = () => {
    console.log("Closing sidebar");
    setSelectedAudiobook(null);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <LoginPage />, errorElement: <h1>Error!</h1> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/forgotpassword", element: <ForgotPasswordPage /> },
        {
          path: "/resetuserpassword/:token",
          element: <ResetPasswordPage isAuthor={false} />, // User reset password
        },
        {
          path: "/resetauthorpassword/:token",
          element: <ResetPasswordPage isAuthor={true} />, // Author reset password
        },

        { path: "/verifyEmail/:verifyToken", element: <EmailVerifyPage /> },
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "/home",
              element: <HomePage onBookSelect={handleBookSelect} />,
            },
            {
              path: "/profile/user",
              element: <ProfilePage isAuthor={false} />,
            },
            {
              path: "/profile/author",
              element: <ProfilePage isAuthor={true} />,
            },
            { path: "/categories", element: <CategoriesPage /> },
            {
              path: "/category/:category",
              element: <CategoryAudiobooksPage />,
            },
            { path: "/about", element: <AboutSection /> },
            { path: "/library", element: <LibraryPage /> },
            { path: "/authors", element: <AuthorsPage /> },
            { path: "/authors/:authorId", element: <AuthorStoriesPage /> },
            { path: "/bestsellers", element: <BestSellers /> },
          ],
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        {sidebarContainer &&
          selectedAudiobook &&
          createPortal(
            <SidebarPlayer
              audiobook={selectedAudiobook}
              onClose={handleCloseSidebar}
            />,
            sidebarContainer
          )}
      </PersistGate>
      <ToastContainer />
    </Provider>
  );
};

export default App;
