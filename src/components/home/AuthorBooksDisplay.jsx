// import React, { useState } from "react";
// import ReactStars from "react-stars";
// import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer";
// import styles from "../books/sidebar/SidebarPlayer.module.css";
// import { useGetAudiobooksAPIQuery } from "../../store/audiobooks/audiobookApiSlice";

// const AuthorBooksDisplay = ({ books, onBookSelect }) => {
//   // Receive onBookSelect
//   const {
//     data: audiobooks,
//     isLoading,
//     isError,
//     error,
//   } = useGetAudiobooksAPIQuery();
//   const [selectedAudiobook, setSelectedAudiobook] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);
//   const handleBookSelect = (book) => {
//     setSelectedAudiobook(book);
//     setIsSidebarOpen(true);
//   };
//   const handleCloseSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   const handleToggleMaximize = () => {
//     setIsSidebarMaximized(!isSidebarMaximized);
//   };
//   console.log("AuthorBooksDisplay books:", books);
//   return (
//     <div>
//       <SidebarPlayer
//         audiobook={selectedAudiobook}
//         onClose={handleCloseSidebar}
//         onToggleMaximize={handleToggleMaximize}
//         isMaximized={isSidebarMaximized}
//         isOpen={isSidebarOpen}
//         className={styles.sidebar}
//       />
//       <div className="popular-stories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
//         {books &&
//           books.map((book) => {
//             const rating = book?.rating || 0;

//             return (
//               <div
//                 className="mb-7 p-2 rounded group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
//                 key={book.id}
//               >
//                 <div className="pt-[100%] relative overflow-hidden rounded-xl">
//                   <img
//                     src={
//                       book.coverImageData
//                         ? `data:image/jpeg;base64,${book?.coverImageData}`
//                         : book?.coverImageUrl ||
//                           "./images/default-book-cover.png"
//                     }
//                     alt={book?.title}
//                     className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 cursor-pointer"
//                     onClick={() => {
//                       console.log("Image clicked. Book object:", book); // Log the book object!
//                       onBookSelect(book);
//                     }}
//                     loading="lazy" // Lazy load images
//                   />
//                   {/* Star Rating */}
//                   <div className="absolute top-2 left-2">
//                     <ReactStars
//                       count={5}
//                       size={24}
//                       color2={"#ffd700"}
//                       half={false}
//                       value={rating}
//                       edit={false}
//                     />
//                   </div>

//                   <div
//                     className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
//                     onClick={() => {
//                       console.log("Overlay clicked. Book object:", book); // Log the book object!
//                       onBookSelect(book);
//                     }}
//                   >
//                     <div className="text-center">
//                       <h6 className="text-xl font-semibold">{book?.title}</h6>
//                       <p className="text-sm">{book?.authorName}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default AuthorBooksDisplay;
import React from "react";
import ReactStars from "react-stars";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer";
import styles from "../books/sidebar/SidebarPlayer.module.css";

const AuthorBooksDisplay = ({ books, onBookSelect }) => {
  const [selectedAudiobook, setSelectedAudiobook] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarMaximized, setIsSidebarMaximized] = React.useState(false);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleMaximize = () => {
    setIsSidebarMaximized(!isSidebarMaximized);
  };

  return (
    <div>
      {/* Sidebar Player */}
      <SidebarPlayer
        audiobook={selectedAudiobook}
        onClose={handleCloseSidebar}
        onToggleMaximize={handleToggleMaximize}
        isMaximized={isSidebarMaximized}
        isOpen={isSidebarOpen}
        className={styles.sidebar}
      />

      {/* Book Grid */}
      <div className="popular-stories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
        {books &&
          books.map((book) => {
            const rating = book?.rating || 0;
            const coverImage = book.coverImageData
              ? `data:image/jpeg;base64,${book.coverImageData}`
              : book?.coverImageUrl || "./images/default-book-cover.png";

            return (
              <div
                className="mb-7 p-2 rounded group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                key={book.id}
              >
                <div className="pt-[100%] relative overflow-hidden rounded-xl">
                  {/* Book Cover Image */}
                  <img
                    src={coverImage}
                    alt={book?.title || "Book Cover"}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => {
                      setSelectedAudiobook(book);
                      setIsSidebarOpen(true);
                      onBookSelect(book); // Notify parent component
                    }}
                    loading="lazy"
                  />

                  {/* Star Rating */}
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

                  {/* Overlay with Book Title and Author */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedAudiobook(book);
                      setIsSidebarOpen(true);
                      onBookSelect(book); // Notify parent component
                    }}
                  >
                    <div className="text-center">
                      <h6 className="text-xl font-semibold">{book?.title}</h6>
                      <p className="text-sm">{book?.authorName}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AuthorBooksDisplay;
