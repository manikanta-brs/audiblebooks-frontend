// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ImageBanner from "../components/home/ImageBanner.jsx";
// import PopularBooks from "../components/home/PopularStories.jsx";
// import ShowsOfWeek from "../components/home/ShowsOfWeek.jsx";
// import TopStories from "../components/home/TopStories.jsx";
// import { setUserProfile } from "../store/user/authSlice.js";
// import { useGetUserProfileAPIQuery } from "../store/user/userApiSlice.js";
// import { useGetAuthorProfileAPIQuery } from "../store/user/authorApiSlice.js";
// import { useGetAudiobooksAPIQuery } from "../store/audiobooks/audiobookApiSlice.js";
// import LoadingSpinner from "../components/LoadingSpinner.jsx";
// import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer.jsx";
// import styles from "./HomePage.module.css";
// import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
// import { toast } from "react-toastify";

// const HomePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation(); // Use useLocation hook
//   const { isLoggedIn, isAuthorLogin } = useSelector((state) => state.auth);

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
//     error: profileError,
//   } = profileQuery;

//   const {
//     data: audiobooksData,
//     isLoading: isAudiobooksLoading,
//     isError: isAudiobooksError,
//     error: audiobooksError,
//   } = useGetAudiobooksAPIQuery();
//   // console.log("audiobooksData:", audiobooksData);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAudiobook, setSelectedAudiobook] = useState(null);

//   const isLoading = isProfileLoading || isAudiobooksLoading;

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login", { replace: true });
//     }
//   }, [isLoggedIn, navigate, location.pathname]); // Add location.pathname to the dependency array

//   useEffect(() => {
//     if (profileData) {
//       dispatch(setUserProfile(profileData));
//     }
//   }, [profileData, dispatch]);

//   const filteredAudiobooks = useMemo(() => {
//     if (!audiobooksData) return [];

//     if (!searchQuery) return audiobooksData;

//     const lowerCaseQuery = searchQuery.toLowerCase();
//     return audiobooksData.filter(
//       (book) =>
//         book.title?.toLowerCase().includes(lowerCaseQuery) ||
//         book.authorName?.toLowerCase().includes(lowerCaseQuery)
//     );
//   }, [audiobooksData, searchQuery]);

//   const handleBookSelect = (book) => {
//     setSelectedAudiobook(book);
//   };

//   const handleCloseSidebar = () => {
//     setSelectedAudiobook(null); // Key Change: Set to null!
//   };

//   if (!isLoggedIn) {
//     return null; // Don't render anything until logged in
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (isProfileError) {
//     return (
//       <p>Error loading profile: {profileError?.message || "Unknown error"}</p>
//     );
//   }

//   if (isAudiobooksError) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <p className="text-gray-600">
//           {audiobooksError?.message || "Error loading audiobooks."}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.homePageContainer}>
//       {selectedAudiobook && (
//         <SidebarPlayer
//           audiobook={selectedAudiobook}
//           onClose={handleCloseSidebar}
//           userType={isAuthorLogin ? "author" : "user"}
//           className={styles.sidebar}
//         />
//       )}

//       <div className={styles.content}>
//         <div className="container mx-auto p-2">
//           <div className="relative z-0">
//             <ImageBanner />
//           </div>
//           <div className="mb-4 mt-8 flex justify-center" id="books">
//             <input
//               type="text"
//               placeholder="Search books..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* <section>
//             {audiobooksData ? (
//               <>
//                 {audiobooksData.length === 0 && !searchQuery ? (
//                   <div className="text-black text-center mt-4">
//                     We don't have any books available right now. Please check
//                     back later!
//                   </div>
//                 ) : searchQuery && filteredAudiobooks.length === 0 ? (
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
//             ) : null}
//           </section> */}
//           <section>
//             {audiobooksData ? (
//               <>
//                 {audiobooksData.length === 0 && !searchQuery ? (
//                   <div className="text-black text-center mt-4">
//                     We don't have any books available right now. Please check
//                     back later!
//                   </div>
//                 ) : searchQuery && filteredAudiobooks.length === 0 ? (
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
//             ) : null}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// HomePage.js
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
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { toast } from "react-toastify";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook
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
    refetch: refetchProfile,
  } = profileQuery;

  const {
    data: audiobooksData,
    isLoading: isAudiobooksLoading,
    isError: isAudiobooksError,
    error: audiobooksError,
  } = useGetAudiobooksAPIQuery();
  // console.log("audiobooksData:", audiobooksData);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);

  const isLoading = isProfileLoading || isAudiobooksLoading;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]); // Add location.pathname to the dependency array

  useEffect(() => {
    if (profileData) {
      dispatch(setUserProfile(profileData));
    }
  }, [profileData, dispatch]);

  // Refetch profile data whenever the component mounts or when navigating to /home
  useEffect(() => {
    if (isLoggedIn) {
      refetchProfile(); // Trigger a refetch of the profile data
    }
  }, [isLoggedIn, refetchProfile, location.pathname]);

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
  };

  const handleCloseSidebar = () => {
    setSelectedAudiobook(null); // Key Change: Set to null!
  };

  if (!isLoggedIn) {
    return null; // Don't render anything until logged in
  }

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
      {selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          userType={isAuthorLogin ? "author" : "user"}
          className={styles.sidebar}
        />
      )}

      <div className={styles.content}>
        <div className="container mx-auto p-2">
          <div className="relative z-0">
            <ImageBanner />
          </div>
          <div className="mb-4 mt-8 flex justify-center" id="books">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* <section>
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
          </section> */}
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
