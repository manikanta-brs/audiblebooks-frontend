import React from "react";

const SearchBar = ({ setSearchQuery }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search books..."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
