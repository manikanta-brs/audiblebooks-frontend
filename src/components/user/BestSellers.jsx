import React, { useState } from "react";
import { useGetAudiobooksAPIQuery } from "../../store/audiobooks/audiobookApiSlice";
import LoadingSpinner from "../LoadingSpinner";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer";
import styles from "../books/sidebar/SidebarPlayer.module.css";
import PopularBooks from "../home/PopularStories";
import { useSelector } from "react-redux"; // Import useSelector

const BestSellers = () => {
  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
  } = useGetAudiobooksAPIQuery();

  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

  // Retrieve isLoggedIn and isAuthorLogin from Redux state
  const { isLoggedIn, isAuthorLogin } = useSelector((state) => state.auth); //useSelector import
  const userType = isAuthorLogin ? "author" : "user";

  const handleBookSelect = (book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedAudiobook(null);
  };

  const handleToggleMaximize = () => {
    setIsSidebarMaximized(!isSidebarMaximized);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message || "Failed to load data."}</div>;
  }

  if (!audiobooks || !Array.isArray(audiobooks)) {
    return <div>No bestsellers found.</div>;
  }

  const sortedAudiobooks = [...audiobooks].sort((a, b) => b.rating - a.rating);
  const top10Audiobooks = sortedAudiobooks.slice(0, 10);

  return (
    <div className="mt-16">
      {selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          userType={userType} // Pass the userType prop!
        />
      )}

      {/* Updated Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 inline-block relative">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Top 10 Bestsellers
          </span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          Discover the most popular audiobooks of the month
        </p>
      </div>

      {top10Audiobooks.length > 0 ? (
        <PopularBooks
          stories={top10Audiobooks}
          onBookSelect={handleBookSelect}
        />
      ) : (
        <div>No bestsellers available.</div>
      )}
    </div>
  );
};

export default BestSellers;
