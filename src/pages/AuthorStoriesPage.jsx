import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PopularBooks from "../components/home/PopularStories";
import { useGetAuthorBooksAPIQuery } from "../store/audiobooks/audiobookApiSlice";
import { useGetAuthorsAPIQuery } from "../store/user/authorApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer";

const AuthorStoriesPage = () => {
  const { authorId } = useParams();
  // console.log("Author ID:", authorId); // Debugging
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
    endpointName,
  } = useGetAuthorBooksAPIQuery(authorId);
  // console.log("Audiobooks:", audiobooks);
  // console.log(`Endpoint used is: ${endpointName}`); // Log it for debugging

  const {
    data: authors,
    isLoading: authorsLoading,
    isError: authorsError,
    error: authorsErrorData,
  } = useGetAuthorsAPIQuery();
  // console.log("Authors:", authors);
  // now get the author name from authors.first_name by stringfyying the authorID and compare with author._id in strings
  const authorName = authors?.find(
    (author) => author._id === authorId
  )?.first_name;
  // console.log("Author Name:", authorName);

  const filteredAudiobooks = useMemo(() => {
    if (!audiobooks) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return audiobooks.filter((book) => {
      return book.title.toLowerCase().includes(lowerSearchTerm);
    });
  }, [audiobooks, searchTerm]);

  const handleBookSelect = (book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedAudiobook(null);
  };

  const handleBackToAuthor = () => {
    navigate(`/authors`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <p>Error: {error?.data?.message || "Failed to fetch stories"}</p>;
  }

  if (!audiobooks || audiobooks.length === 0) {
    return (
      <div className="container mx-auto mt-16 p-5">
        <h2 className="text-2xl font-bold mb-5">Stories by {authorName}</h2>
        <p className="text-gray-600">No stories found for this author.</p>
        <button
          onClick={handleBackToAuthor}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Back to Authors
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Stories by {authorName}</h2>
        <button
          onClick={handleBackToAuthor}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Authors
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search audiobooks by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      {/* SidebarPlayer */}
      {isSidebarOpen && selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          userType="author"
        />
      )}

      {/* PopularBooks Component */}
      <PopularBooks
        stories={filteredAudiobooks}
        onBookSelect={handleBookSelect}
      />
    </div>
  );
};

export default AuthorStoriesPage;
