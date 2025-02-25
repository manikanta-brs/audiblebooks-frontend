// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useGetAuthorsAPIQuery } from "../store/user/authorApiSlice";
// import LoadingSpinner from "../components/LoadingSpinner";

// const AuthorsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const { data: authors = [], error, isLoading } = useGetAuthorsAPIQuery();

//   // get current user id or author id form local storage
//   const userData = localStorage.getItem("userData");
//   const currentUserId = userData ? JSON.parse(userData)._id : null;

//   // filter authors dont have this user id
//   const filteredAuthors = authors.filter(
//     (author) => author._id !== currentUserId
//   );

//   // Filter authors based on search term
//   const searchedAuthors = filteredAuthors.filter((author) => {
//     const fullName = `${author.first_name} ${author.last_name}`.toLowerCase();
//     return fullName.includes(searchTerm.toLowerCase());
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <p className="text-center text-red-500 mt-16">Error fetching authors.</p>
//     );
//   }

//   return (
//     <div className="p-8 max-w-7xl mx-auto mt-16">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold text-gray-800 inline-block relative">
//           <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Discover Authors
//           </span>
//           <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//         </h2>
//         <p className="mt-2 text-gray-600 text-lg">
//           Explore a diverse range of talented authors
//         </p>
//       </div>
//       {/* Search Bar */}
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search authors..."
//           className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {searchedAuthors.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {searchedAuthors.map((author) => (
//             <Link
//               to={`/authors/${author._id}`}
//               key={author._id}
//               className="group"
//             >
//               <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
//                 <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
//                   <img
//                     src={author.avatar}
//                     alt={`${author.first_name} ${author.last_name}`}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src =
//                         "https://cdn-icons-png.flaticon.com/512/4322/4322991.png";
//                     }}
//                   />
//                 </div>
//                 <div className="mt-4 text-center">
//                   <h6 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors duration-200">
//                     {author.first_name} {author.last_name}
//                   </h6>
//                   <p className="text-sm text-gray-500">
//                     {author.bio || "Author & Storyteller"}
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-600 mt-16">
//           No authors found matching your search.
//         </p>
//       )}
//     </div>
//   );
// };

// export default AuthorsPage;

import React, { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import { useGetAuthorsAPIQuery } from "../store/user/authorApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";

const AuthorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: authors = [],
    error,
    isLoading,
    refetch,
  } = useGetAuthorsAPIQuery(); // Get refetch function
  const auth = useSelector((state) => state.auth);

  // useEffect to trigger refetch when auth.userData.profileData changes
  useEffect(() => {
    refetch();
  }, [auth.userData?.profileData, refetch]);

  const currentUserId = auth.userData?.profileData?._id;

  const modifiedAuthors = authors.map((author) => {
    if (
      author._id === currentUserId &&
      auth.isLoggedIn &&
      auth.userData &&
      auth.userData.profileData
    ) {
      return {
        ...author,
        first_name: auth.userData.profileData.first_name,
        last_name: auth.userData.profileData.last_name,
      };
    }
    return author;
  });

  // filter authors dont have this user id
  const filteredAuthors = modifiedAuthors.filter(
    (author) => author._id !== currentUserId
  );

  // Filter authors based on search term
  const searchedAuthors = filteredAuthors.filter((author) => {
    const fullName = `${author.first_name} ${author.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-16">Error fetching authors.</p>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto mt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 inline-block relative">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Authors
          </span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          Explore a diverse range of talented authors
        </p>
      </div>
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search authors..."
          className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchedAuthors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchedAuthors.map((author) => (
            <Link
              to={`/authors/${author._id}`}
              key={author._id}
              className="group"
            >
              <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={author.avatar}
                    alt={`${author.first_name} ${author.last_name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/4322/4322991.png";
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h6 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors duration-200">
                    {author.first_name} {author.last_name}
                  </h6>
                  <p className="text-sm text-gray-500">
                    {author.bio || "Author & Storyteller"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-16">
          No authors found matching your search.
        </p>
      )}
    </div>
  );
};

export default AuthorsPage;
