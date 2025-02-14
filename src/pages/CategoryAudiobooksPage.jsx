import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAudiobooksByCategoryAPIQuery } from "../store/audiobooks/audiobookApiSlice";
import PopularBooks from "../components/home/PopularStories";
import SidebarPlayer from "../components/books/sidebar/SidebarAudioPlayer"; // Import the sidebar
import LoadingSpinner from "../components/LoadingSpinner";
// const CategoryAudiobooksPage = () => {
//   const { category } = useParams();
//   const [selectedAudiobook, setSelectedAudiobook] = useState(null); // State for selected book

//   const {
//     data: audiobooks,
//     isLoading,
//     isError,
//     error,
//   } = useGetAudiobooksByCategoryAPIQuery(category);

//   if (isLoading) {
//     return <p>Loading audiobooks...</p>;
//   }

//   if (isError) {
//     console.error("Error fetching audiobooks:", error);
//     let errorMessage = "Failed to load audiobooks";
//     if (error?.data?.message) {
//       errorMessage = error.data.message;
//     } else if (error?.message) {
//       errorMessage = error.message;
//     }
//     return <p>Error: {errorMessage}</p>;
//   }

//   if (!isLoading && !isError && !Array.isArray(audiobooks)) {
//     console.error("Audiobooks is not an array:", audiobooks);
//     return <p>Error: Invalid data format received from the server.</p>;
//   }

//   if (!audiobooks || audiobooks.length === 0) {
//     return <p>No audiobooks found in this category.</p>;
//   }

//   // Function to handle book select
//   const handleBookSelect = (story) => {
//     console.log("Selected book:", story);
//     setSelectedAudiobook(story); //Update it here.
//   };

//   const handleCloseSidebar = () => {
//     setSelectedAudiobook(null);
//   };

//   const handleEditBook = (bookId) => {
//     console.log("Edit book with ID:", bookId);
//     // Implement logic to open the edit form
//   };

//   const handleDeleteBook = (bookId) => {
//     console.log("Delete book with ID:", bookId);
//     // Implement logic to delete the book
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-semibold mb-4">
//         Audiobooks in Category: {category}
//       </h2>

//       <PopularBooks
//         stories={audiobooks}
//         onBookSelect={handleBookSelect} // Update handler
//         onEditBook={handleEditBook}
//         onDeleteBook={handleDeleteBook}
//         showAdminActions={false}
//       />
//       {selectedAudiobook && (
//         <SidebarPlayer
//           audiobook={selectedAudiobook}
//           onClose={handleCloseSidebar}
//           isOpen={true} // Always keep it open
//           isMaximized={false} //Set it to false and if you want a maximize feature let me know.
//           // onToggleMaximize = {
//         />
//       )}
//     </div>
//   );
// };

// export default CategoryAudiobooksPage;import { useGetAudiobooksByCategoryAPIQuery } from "../store/audiobooks/audiobookApiSlice";

// const CategoryAudiobooksPage = () => {
//   const { category } = useParams();
//   const [selectedAudiobook, setSelectedAudiobook] = useState(null);

//   const {
//     data: audiobooks,
//     isLoading,
//     isError,
//     error,
//   } = useGetAudiobooksByCategoryAPIQuery(category, {
//     skip: !category, // Avoid making an unnecessary request if category is undefined
//   });

//   // ✅ Display loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   // ✅ Handle API errors gracefully
//   if (isError) {
//     console.error("Error fetching audiobooks:", error);
//     const errorMessage =
//       error?.data?.message || error?.message || "Failed to load audiobooks";
//     return (
//       <div className="text-center text-red-600 mt-10">
//         <h3 className="text-lg font-semibold">{errorMessage}</h3>
//       </div>
//     );
//   }

//   // ✅ Ensure audiobooks is an array before rendering
//   if (!Array.isArray(audiobooks)) {
//     console.error("Invalid data format received:", audiobooks);
//     return (
//       <div className="text-center text-red-600 mt-10">
//         <h3 className="text-lg font-semibold">
//           Error: Invalid data format received from the server.
//         </h3>
//       </div>
//     );
//   }

//   // ✅ Handle case where no audiobooks are found
//   const noBooksFound = audiobooks.length === 0;

//   // Handle error message if no books found
//   const errorMessage = noBooksFound
//     ? "No Books Found!"
//     : error?.data?.message || "Failed to load audiobooks";

//   // 🎯 Function to handle book selection
//   const handleBookSelect = (story) => {
//     console.log("Selected book:", story);
//     setSelectedAudiobook(story);
//   };

//   const handleCloseSidebar = () => setSelectedAudiobook(null);

//   const handleEditBook = (bookId) => console.log("Edit book with ID:", bookId);

//   const handleDeleteBook = (bookId) =>
//     console.log("Delete book with ID:", bookId);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-semibold mb-4">
//         Audiobooks in Category: {decodeURIComponent(category)}
//       </h2>

//       {noBooksFound ? (
//         <div className="text-center mt-6">
//           {" "}
//           {/* Added a div container and mt-6 for spacing */}
//           <h3 className="text-lg text-gray-600 font-semibold">
//             {" "}
//             {/* Made font-semibold for emphasis */}
//             {errorMessage}
//           </h3>
//           <p className="text-gray-500 mt-2">
//             {" "}
//             {/* Added a descriptive paragraph */}
//             Sorry, we couldn't find any audiobooks in the "
//             {decodeURIComponent(category)}" category. Please try a different
//             category or check back later.
//           </p>
//         </div>
//       ) : (
//         <PopularBooks
//           stories={audiobooks}
//           onBookSelect={handleBookSelect}
//           onEditBook={handleEditBook}
//           onDeleteBook={handleDeleteBook}
//           showAdminActions={false}
//         />
//       )}

//       {selectedAudiobook && (
//         <SidebarPlayer
//           audiobook={selectedAudiobook}
//           onClose={handleCloseSidebar}
//           isOpen
//           isMaximized={false}
//         />
//       )}
//     </div>
//   );
// };

const CategoryAudiobooksPage = () => {
  const { category } = useParams();
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);

  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
  } = useGetAudiobooksByCategoryAPIQuery(category, {
    skip: !category, // Avoid making an unnecessary request if category is undefined
  });

  // ✅ Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // ✅ Handle API errors gracefully
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

  // ✅ Ensure audiobooks is an array before rendering
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

  // ✅ Handle case where no audiobooks are found
  const noBooksFound = audiobooks.length === 0;

  // Handle error message if no books found
  const errorMessage = noBooksFound
    ? "No Books Found!"
    : error?.data?.message || "Failed to load audiobooks";

  // 🎯 Function to handle book selection
  const handleBookSelect = (story) => {
    console.log("Selected book:", story);
    setSelectedAudiobook(story);
  };

  const handleCloseSidebar = () => setSelectedAudiobook(null);

  const handleEditBook = (bookId) => console.log("Edit book with ID:", bookId);

  const handleDeleteBook = (bookId) =>
    console.log("Delete book with ID:", bookId);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        Audiobooks in Category: {decodeURIComponent(category)}
      </h2>

      {noBooksFound ? (
        <div className="text-center mt-16 z-10 relative ">
          {" "}
          {/* Added z-10 and relative */}
          <h3 className="text-lg text-gray-600 font-semibold mt-16">
            {errorMessage}
          </h3>
          <p className="text-gray-500 mt-2">
            Sorry, we couldn't find any audiobooks in the "
            {decodeURIComponent(category)}" category. Please try a different
            category or check back later.
          </p>
        </div>
      ) : (
        <PopularBooks
          stories={audiobooks}
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
        />
      )}
    </div>
  );
};

export default CategoryAudiobooksPage;
