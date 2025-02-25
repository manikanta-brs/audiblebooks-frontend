import React, { useState } from "react";
import "../index.css";
import { useGetCategoriesAPIQuery } from "../store/categories/categoryApiSlice.js"; //Correct API Slice reference
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import LoadingSpinner from "../components/LoadingSpinner.jsx"; // Import LoadingSpinner component

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoriesAPIQuery();
  const filteredCategories = categories
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`); // Programmatically navigate
  };

  return (
    <>
      {/* Categories Section */}
      <div className="m-5 mt-16">
        {/* Heading and Search Bar */}
        <div className="flex justify-between items-center mb-8">
          {/* Categories Heading */}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mt-10">
            Categories
          </h1>
          {/* Search Bar */}
          <div className="relative bg-white rounded-full shadow-md border border-gray-300 focus-within:border-blue-500 transition-all duration-200">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 rounded-full focus:outline-none text-gray-800 placeholder-gray-500 pr-10 bg-white" //Explicit white bg and darker text
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" // Darker icon
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
                onClick={() => handleCategoryClick(category.name)} // Add onClick handler to the outer div
              >
                {/* Inner Circle */}
                <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-white flex items-center justify-center">
                  {/* Removed NavLink and kept the text */}
                  <div className="text-center text-gray-800 font-bold hover:text-gray-600 transition-colors duration-300 text-sm sm:text-lg md:text-xl lg:text-2xl">
                    {category.name}
                  </div>
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
