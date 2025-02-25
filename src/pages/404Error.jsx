// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// const NotFoundPage = () => {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-100 to-gray-200">
//       <motion.div
//         className="text-center p-8 bg-white rounded-lg shadow-2xl transform transition-all hover:scale-105"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Illustration or Icon */}
//         <div className="mb-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-24 w-24 mx-auto text-green-600"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         </div>

//         {/* 404 Text */}
//         <motion.h1
//           className="text-6xl font-bold text-gray-800 mb-4"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//         >
//           404
//         </motion.h1>
//         <h2 className="text-2xl text-gray-600 mb-6">Oops! Page not found.</h2>

//         {/* Description */}
//         <p className="text-gray-500 mb-8">
//           The page you're looking for doesn't exist or has been moved.
//         </p>

//         {/* Return to Home Button */}
//         <Link
//           to="/"
//           className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
//         >
//           Return to Home
//         </Link>
//       </motion.div>
//     </div>
//   );
// };

// export default NotFoundPage;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux"; // Import useSelector

const NotFoundPage = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get isLoggedIn from Redux

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-100 to-gray-200">
      <motion.div
        className="text-center p-8 bg-white rounded-lg shadow-2xl transform transition-all hover:scale-105"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration or Icon */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 404 Text */}
        <motion.h1
          className="text-6xl font-bold text-gray-800 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl text-gray-600 mb-6">Oops! Page not found.</h2>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Conditional Return Button */}
        {isLoggedIn ? (
          <Link
            to="/home"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
          >
            Return to Home
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
          >
            Return to Login
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
