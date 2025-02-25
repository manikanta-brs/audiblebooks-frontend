import React, { useState } from "react";
import ReactStars from "react-stars";
import { useNavigate } from "react-router-dom";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer";
import styles from "../books/sidebar/SidebarPlayer.module.css";
import LoadingSpinner from "../LoadingSpinner";

const AuthorBooksDisplay = ({ books, onBookSelect }) => {
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const navigate = useNavigate();

  // console.log("books:", books); // Log the books prop to check its structure

  const handleGoBack = () => {
    navigate("/authors");
  };

  const handleCloseSidebar = () => {
    setSelectedAudiobook(null);
  };

  const handleBookClick = (book) => {
    // console.log("Book clicked:", book); // Log the clicked book
    setSelectedAudiobook(book);
    // console.log("selectedAudiobook after click:", selectedAudiobook); // Log state *after* setting it
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  return (
    <div>
      {selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          userType="author"
          className={styles.sidebar}
        />
      )}

      <button
        onClick={handleGoBack}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <span>Back to Authors</span>
      </button>

      <div className="popular-stories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => {
            const rating = book?.rating || 0;
            const coverImage = book.coverImage
              ? `data:image/jpeg;base64,${book.coverImageData}`
              : book?.coverImageUrl || "./images/default-book-cover.png";

            return (
              <div
                className="mb-7 p-2 rounded group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                key={book.id}
              >
                <div className="pt-[100%] relative overflow-hidden rounded-xl">
                  <img
                    src={coverImage}
                    alt={book?.title || "Book Cover"}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => handleBookClick(book)} // Corrected: Pass the book!
                    loading="lazy"
                  />

                  <div className="absolute top-2 left-2">
                    <ReactStars
                      count={5}
                      size={24}
                      color2={"#ffd700"}
                      half={false}
                      value={rating}
                      edit={false}
                    />
                  </div>

                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => handleBookClick(book)} // Corrected: Pass the book!
                  >
                    <div className="text-center">
                      <h6 className="text-xl font-semibold">{book?.title}</h6>
                      <p className="text-sm">{book?.authorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600">
            No books available for this author.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorBooksDisplay;
