// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ImageBanner from "../components/home/ImageBanner.jsx";
// import PopularBooks from "../components/home/PopularStories.jsx";
// import ShowsOfWeek from "../components/home/ShowsOfWeek.jsx";
// import TopStories from "../components/home/TopStories.jsx";
// import { setUserProfile } from "../store/user/authSlice.js";
// import { useGetUserProfileAPIQuery } from "../store/user/userApiSlice.js";
// import { useGetAuthorProfileAPIQuery } from "../store/user/authorApiSlice.js";
// import { useGetAudiobooksAPIQuery } from "../store/audiobooks/audiobookApiSlice.js"; // Make sure you import the correct hook from the correct file
// import LoadingSpinner from "../components/LoadingSpinner.jsx";
// import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer.jsx";
// import styles from "./HomePage.module.css";

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const { userData, isLoggedIn, isAuthorLogin } = useSelector(
//     (state) => state.auth
//   );

//   const userProfileQuery = useGetUserProfileAPIQuery(undefined, {
//     skip: !isLoggedIn || isAuthorLogin,
//   });
//   const authorProfileQuery = useGetAuthorProfileAPIQuery(undefined, {
//     skip: !isLoggedIn || !isAuthorLogin,
//   });

//   const profileQuery = isAuthorLogin ? authorProfileQuery : userProfileQuery;

//   const {
//     data: profileData,
//     isLoading: isProfileLoading,
//     isError: isProfileError,
//     error: profileError, // Get the error object
//   } = profileQuery;

//   const {
//     data: audiobooksData,
//     isLoading: isAudiobooksLoading,
//     isError: isAudiobooksError,
//     error: audiobooksError, // Get the error object. In your slice, error is returned under `error`.
//   } = useGetAudiobooksAPIQuery();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAudiobook, setSelectedAudiobook] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

//   // Use RTK Query's isLoading directly
//   const isLoading = isProfileLoading || isAudiobooksLoading;

//   useEffect(() => {
//     if (profileData) {
//       dispatch(setUserProfile(profileData));
//     }
//   }, [profileData, dispatch]);

//   const filteredAudiobooks = useMemo(() => {
//     if (!audiobooksData) return [];

//     if (!searchQuery) return audiobooksData; // Return early if no search query

//     const lowerCaseQuery = searchQuery.toLowerCase();
//     return audiobooksData.filter(
//       (book) =>
//         book.title?.toLowerCase().includes(lowerCaseQuery) ||
//         book.authorName?.toLowerCase().includes(lowerCaseQuery)
//     );
//   }, [audiobooksData, searchQuery]);

//   const handleBookSelect = (book) => {
//     setSelectedAudiobook(book);
//     setIsSidebarOpen(true);
//   };

//   const handleCloseSidebar = () => {
//     setSelectedAudiobook(null);
//     setIsSidebarMaximized(false);
//     setIsSidebarOpen(false);
//   };

//   const handleToggleMaximize = () => {
//     setIsSidebarMaximized(!isSidebarMaximized);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (isProfileError || isAudiobooksError) {
//     let errorMessage = "Error loading data.";
//     if (profileError) {
//       errorMessage += ` Profile Error: ${
//         profileError?.message || "Unknown error"
//       }`;
//     }
//     if (audiobooksError) {
//       errorMessage += ` Audiobooks Error: ${
//         audiobooksError?.message || "Unknown error"
//       }`;
//     }

//     return <p>{errorMessage}</p>;
//   }

//   // Check for a specific "no audiobooks" message from the API, which will be inside the 'error' property since that is where you return it in the `transformResponse` function.
//   if (audiobooksError?.error === "No audiobooks found") {
//     // Corrected conditional
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <p className="text-gray-600">
//           We don't have any books available right now. Please check back later!
//         </p>
//       </div>
//     );
//   }

//   // NEW: Check for empty audiobooksData after successful load
//   if (
//     isAudiobooksError &&
//     audiobooksError?.data?.message === "No audiobooks found"
//   ) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <p className="text-gray-600">
//           We don't have any books available right now. Please check back later!
//         </p>
//       </div>
//     );
//   }
//   console.log("isLoading:", isAudiobooksLoading);
//   console.log("isError:", isAudiobooksError);
//   console.log("audiobooksData:", audiobooksData);
//   console.log("audiobooksError:", audiobooksError);

//   return (
//     <div className={styles.homePageContainer}>
//       <SidebarPlayer
//         audiobook={selectedAudiobook}
//         onClose={handleCloseSidebar}
//         onToggleMaximize={handleToggleMaximize}
//         isMaximized={isSidebarMaximized}
//         isOpen={isSidebarOpen}
//         userType={isAuthorLogin ? "author" : "user"}
//         className={styles.sidebar}
//       />
//       <div className={styles.content}>
//         <div className="container mx-auto p-2">
//           <div className="relative z-0">
//             <ImageBanner />
//           </div>
//           <div className="mb-4 mt-8 flex justify-center">
//             <input
//               type="text"
//               placeholder="Search books..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <section>
//             {audiobooksData && (
//               <>
//                 {searchQuery && filteredAudiobooks.length === 0 ? (
//                   <div className="text-black text-center mt-4">
//                     No books found for "{searchQuery}"!
//                   </div>
//                 ) : (
//                   <PopularBooks
//                     stories={searchQuery ? filteredAudiobooks : audiobooksData}
//                     onBookSelect={handleBookSelect}
//                   />
//                 )}
//               </>
//             )}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageBanner from "../components/home/ImageBanner.jsx";
import PopularBooks from "../components/home/PopularStories.jsx";
import ShowsOfWeek from "../components/home/ShowsOfWeek.jsx";
import TopStories from "../components/home/TopStories.jsx";
import { setUserProfile } from "../store/user/authSlice.js";
import { useGetUserProfileAPIQuery } from "../store/user/userApiSlice.js";
import { useGetAuthorProfileAPIQuery } from "../store/user/authorApiSlice.js";
import { useGetAudiobooksAPIQuery } from "../store/audiobooks/audiobookApiSlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer.jsx";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, isAuthorLogin } = useSelector((state) => state.auth);

  const userProfileQuery = useGetUserProfileAPIQuery(undefined, {
    skip: !isLoggedIn || isAuthorLogin,
  });
  const authorProfileQuery = useGetAuthorProfileAPIQuery(undefined, {
    skip: !isLoggedIn || !isAuthorLogin,
  });

  const profileQuery = isAuthorLogin ? authorProfileQuery : userProfileQuery;

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = profileQuery;

  const {
    data: audiobooksData,
    isLoading: isAudiobooksLoading,
    isError: isAudiobooksError,
    error: audiobooksError, // Get the error object
  } = useGetAudiobooksAPIQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

  const isLoading = isProfileLoading || isAudiobooksLoading;

  useEffect(() => {
    console.log("profileData:", profileData); // CHECK if profileData is coming

    if (profileData) {
      dispatch(setUserProfile(profileData));
    }
  }, [profileData, dispatch]);

  const filteredAudiobooks = useMemo(() => {
    if (!audiobooksData) return [];

    if (!searchQuery) return audiobooksData;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return audiobooksData.filter(
      (book) =>
        book.title?.toLowerCase().includes(lowerCaseQuery) ||
        book.authorName?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [audiobooksData, searchQuery]);

  const handleBookSelect = (book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedAudiobook(null);
    setIsSidebarMaximized(false);
    setIsSidebarOpen(false);
  };

  const handleToggleMaximize = () => {
    setIsSidebarMaximized(!isSidebarMaximized);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isProfileError) {
    return (
      <p>Error loading profile: {profileError?.message || "Unknown error"}</p>
    );
  }

  if (isAudiobooksError) {
    // Simplified error handling using the error from transformResponse
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600">
          {audiobooksError?.message || "Error loading audiobooks."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.homePageContainer}>
      <SidebarPlayer
        audiobook={selectedAudiobook}
        onClose={handleCloseSidebar}
        onToggleMaximize={handleToggleMaximize}
        isMaximized={isSidebarMaximized}
        isOpen={isSidebarOpen}
        userType={isAuthorLogin ? "author" : "user"}
        className={styles.sidebar}
      />
      <div className={styles.content}>
        <div className="container mx-auto p-2">
          <div className="relative z-0">
            <ImageBanner />
          </div>
          <div className="mb-4 mt-8 flex justify-center">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <section>
            {audiobooksData ? (
              <>
                {audiobooksData.length === 0 && !searchQuery ? (
                  <div className="text-black text-center mt-4">
                    We don't have any books available right now. Please check
                    back later!
                  </div>
                ) : searchQuery && filteredAudiobooks.length === 0 ? (
                  <div className="text-black text-center mt-4">
                    No books found for "{searchQuery}"!
                  </div>
                ) : (
                  <PopularBooks
                    stories={searchQuery ? filteredAudiobooks : audiobooksData}
                    onBookSelect={handleBookSelect}
                  />
                )}
              </>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
