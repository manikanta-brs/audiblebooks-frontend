// import React from "react";
// import { useParams } from "react-router-dom";
// import AuthorBooksDisplay from "../components/home/AuthorBooksDisplay";
// import { useGetAuthorBooksAPIQuery } from "../store/audiobooks/audiobookApiSlice";

// const AuthorStoriesPage = ({ onBookSelect }) => {
//   // Receive the onBookSelect function as a prop
//   const { authorId } = useParams();
//   console.log("Author ID:", authorId);

//   const {
//     data: audiobooks,
//     isLoading,
//     isError,
//     error,
//   } = useGetAuthorBooksAPIQuery(authorId);

//   console.log("Audiobooks:", audiobooks);

//   if (isLoading) {
//     return <p className="mt-16">Loading stories...</p>;
//   }

//   if (isError) {
//     return <p>Error: {error?.data?.message || "Failed to fetch stories"}</p>;
//   }

//   return (
//     <div className="container mx-auto mt-16 p-5">
//       <h2 className="text-2xl font-bold mb-5">Stories by Author</h2>
//       {audiobooks?.length > 0 ? (
//         <AuthorBooksDisplay
//           books={audiobooks}
//           onBookSelect={onBookSelect} // Pass the onBookSelect prop
//         />
//       ) : (
//         <p>No stories found for this author.</p>
//       )}
//     </div>
//   );
// };

// export default AuthorStoriesPage;
import React from "react";
import { useParams } from "react-router-dom";
import AuthorBooksDisplay from "../components/home/AuthorBooksDisplay";
import { useGetAuthorBooksAPIQuery } from "../store/audiobooks/audiobookApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthorStoriesPage = ({ onBookSelect }) => {
  const { authorId } = useParams();
  console.log("Author ID:", authorId);

  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
  } = useGetAuthorBooksAPIQuery(authorId);

  console.log("Audiobooks:", audiobooks);

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

  // Handle cases where audiobooks is empty, undefined, or null
  if (!audiobooks || audiobooks.length === 0) {
    return (
      <div className="container mx-auto mt-16 p-5">
        <h2 className="text-2xl font-bold mb-5 mt-16 ">Stories by Author</h2>
        <p className="text-gray-600">No stories found for this author.</p>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return <p>Error: {error?.data?.message || "Failed to fetch stories"}</p>;
  }

  // Render the list of audiobooks
  return (
    <div className="container mx-auto mt-16 p-5">
      <h2 className="text-2xl font-bold mb-5">Stories by Author</h2>
      <AuthorBooksDisplay
        books={audiobooks}
        onBookSelect={onBookSelect} // Pass the onBookSelect prop
      />
    </div>
  );
};

export default AuthorStoriesPage;
