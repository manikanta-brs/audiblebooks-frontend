import React from "react";
import { useGetAudiobooksAPIQuery } from "../../store/audiobooks/audiobookApiSlice";
import LoadingSpinner from "../LoadingSpinner";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer";
import styles from "../books/sidebar/SidebarPlayer.module.css";
import { useState } from "react";
import PopularBooks from "../home/PopularStories";
// import styles from "../pages/Home.module.css";

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
  const handleBookSelect = (book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  };
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleMaximize = () => {
    setIsSidebarMaximized(!isSidebarMaximized);
  };

  // console.log("Audiobooks:", audiobooks);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {" "}
        {/* Center the spinner */}
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message || "Failed to load data."}</div>; // Handle error scenarios
  }

  // Check if audiobooks is defined and is an array before proceeding
  if (!audiobooks || !Array.isArray(audiobooks)) {
    return <div>No bestsellers found.</div>; // Handle the case where audiobooks is undefined or not an array
  }

  // 1. Sort the audiobooks array in descending order based on rating
  const sortedAudiobooks = [...audiobooks].sort((a, b) => b.rating - a.rating);

  // 2. Slice the sorted array to get the top 10 books
  const top10Audiobooks = sortedAudiobooks.slice(0, 10);

  // 3. Render the top 10 audiobooks (replace with your actual rendering logic)
  return (
    <div className="mt-16">
      <SidebarPlayer
        audiobook={selectedAudiobook}
        onClose={handleCloseSidebar}
        onToggleMaximize={handleToggleMaximize}
        isMaximized={isSidebarMaximized}
        isOpen={isSidebarOpen}
        className={styles.sidebar}
      />
      <h2>Top 10 Bestsellers</h2>
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
