import React, { useState } from "react";
import "../index.css";
import { useGetCategoriesAPIQuery } from "../store/categories/categoryApiSlice.js"; //Correct API Slice reference
import { NavLink } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.jsx"; // Import LoadingSpinner component

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoriesAPIQuery();

  console.log("Categories:", categories);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // Filter categories based on search input
  const filteredCategories = categories
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Categories Section */}
      <div className="m-5 mt-16">
        {/* Heading and Search Bar */}
        <div className="flex justify-between items-center mb-8">
          {/* Categories Heading */}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Categories
          </h1>
          {/* Search Bar */}
          <div className="relative backdrop-filter backdrop-blur-md bg-white bg-opacity-10 rounded-full shadow-lg border border-gray-200 border-opacity-20">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-full bg-transparent focus:outline-none text-black placeholder-gray-300 pr-10" /* pr-10 to give space for icon */
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 justify-center items-center">
          {" "}
          {/* Added justify-center and items-center */}
          {/* Display loading state */}
          {isLoading ? (
            <div className="col-span-full flex justify-center">
              {" "}
              {/* Centered LoadingSpinner */}
              <LoadingSpinner />
            </div>
          ) : isError ? (
            // Display error state
            <p className="text-red-500 text-lg col-span-full text-center">
              Error: {error?.data?.message || "Failed to load categories"}
            </p>
          ) : filteredCategories.length > 0 ? (
            // Display filtered categories
            filteredCategories.map((category) => (
              <div
                key={category._id}
                className="
                  p-6 rounded-full transition-all duration-300 ease-in-out
                  hover:shadow-2xl hover:scale-105
                  active:scale-95
                  w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64
                  flex items-center justify-center
                  bg-gradient-to-r from-blue-500 to-teal-400
                  group cursor-pointer relative
                  hover:animate-rotate-gradient
                "
              >
                {/* Inner Circle */}
                <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-white flex items-center justify-center">
                  <NavLink
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="text-center text-gray-800 font-bold hover:text-gray-600 transition-colors duration-300 text-sm sm:text-lg md:text-xl lg:text-2xl"
                  >
                    {category.name}
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            // No Categories Found
            <p className="text-gray-600 text-lg col-span-full text-center">
              No categories found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
