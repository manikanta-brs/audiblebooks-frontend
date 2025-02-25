import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetAudiobooksByCategoryAPIQuery } from "../store/audiobooks/audiobookApiSlice";
import PopularBooks from "../components/home/PopularStories";
import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";

const CategoryAudiobooksPage = () => {
  const { category } = useParams();
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
  } = useGetAudiobooksByCategoryAPIQuery(category, {
    skip: !category,
  });

  const { isLoggedIn, isAuthorLogin } = useSelector((state) => state.auth);
  const userType = isAuthorLogin ? "author" : "user";

  const filteredAudiobooks = useMemo(() => {
    if (!audiobooks) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return audiobooks.filter((book) => {
      return (
        book.title.toLowerCase().includes(lowerSearchTerm) ||
        book.authorName.toLowerCase().includes(lowerSearchTerm)
        // Add other fields to search if needed (e.g., description)
      );
    });
  }, [audiobooks, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching audiobooks:", error);
    const errorMessage =
      error?.data?.message || error?.message || "Failed to load audiobooks";
    return (
      <div className="text-center text-red-600 mt-16">
        <h3 className="text-lg font-semibold">{errorMessage}</h3>
      </div>
    );
  }

  if (!Array.isArray(audiobooks)) {
    console.error("Invalid data format received:", audiobooks);
    return (
      <div className="text-center text-red-600 mt-10">
        <h3 className="text-lg font-semibold">
          Error: Invalid data format received from the server.
        </h3>
      </div>
    );
  }

  const noBooksFound = audiobooks.length === 0;
  const noSearchResults = !noBooksFound && filteredAudiobooks.length === 0;

  const errorMessage = noBooksFound
    ? "No Books Found!"
    : error?.data?.message || "Failed to load audiobooks";

  const handleBookSelect = (story) => {
    setSelectedAudiobook(story);
  };

  const handleCloseSidebar = () => setSelectedAudiobook(null);

  const handleEditBook = (bookId) => console.log("Edit book successfully");

  const handleDeleteBook = (bookId) => console.log("Delete book successfully");

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        Audiobooks in Category: {decodeURIComponent(category)}
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search audiobooks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {noBooksFound ? (
        <div className="text-center mt-16 z-10 relative ">
          <h3 className="text-lg text-gray-600 font-semibold mt-16">
            {errorMessage}
          </h3>
          <p className="text-gray-500 mt-2">
            Sorry, we couldn't find any audiobooks in the "
            {decodeURIComponent(category)}" category. Please try a different
            category or check back later.
          </p>
        </div>
      ) : noSearchResults ? (
        <div className="text-center mt-16">
          <h3 className="text-lg text-gray-600 font-semibold">
            No results found for "{searchTerm}"
          </h3>
          <p className="text-gray-500 mt-2">
            Please try a different search term.
          </p>
        </div>
      ) : (
        <PopularBooks
          stories={filteredAudiobooks} // Use filtered books
          onBookSelect={handleBookSelect}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          showAdminActions={false}
        />
      )}

      {selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          isOpen
          isMaximized={false}
          userType={userType}
        />
      )}
    </div>
  );
};

export default CategoryAudiobooksPage;
