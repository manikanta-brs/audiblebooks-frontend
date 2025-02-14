// import React from "react";
// import ReactStars from "react-stars";

// const PopularBooks = ({
//   stories,
//   onBookSelect,
//   onEditBook,
//   onDeleteBook,
//   showAdminActions,
// }) => {
//   return (
//     <div>
//       <div className="popular-stories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
//         {stories &&
//           stories.map((story) => {
//             const base64Src = story.coverImageData
//               ? `data:image/jpeg;base64,${story.coverImageData}`
//               : story.url;
//             const rating = story.rating || 0;

//             return (
//               <div
//                 className="mb-7 p-2 rounded group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
//                 key={story.id}
//               >
//                 <div className="pt-[100%] relative overflow-hidden rounded-xl">
//                   <img
//                     src={base64Src}
//                     alt="Story image"
//                     className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
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
//                     onClick={() => onBookSelect(story)} // Moved onClick here
//                   >
//                     <div className="text-center">
//                       <h6 className="text-xl font-semibold">{story.title}</h6>
//                       <p className="text-sm">{story.authorName}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Buttons Below the Image */}
//                 {showAdminActions && (
//                   <div className="flex justify-center mt-2">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs mr-2"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent potential issues
//                         onEditBook(story.id);
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent potential issues
//                         onDeleteBook(story.id);
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default PopularBooks;
import React from "react";
import ReactStars from "react-stars";

const PopularBooks = ({
  stories,
  onBookSelect,
  onEditBook,
  onDeleteBook,
  showAdminActions,
}) => {
  return (
    <div>
      <div className="popular-stories-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6">
        {stories &&
          stories.map((story) => {
            const base64Src = story.coverImageData
              ? `data:image/jpeg;base64,${story.coverImageData}`
              : story.coverImageUrl || "./images/default-book-cover.png"; // Added story.coverImageUrl as fallback and default image path
            const rating = story.rating || 0;

            return (
              <div
                className="mb-7 p-2 rounded group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                key={story.id}
              >
                <div className="pt-[100%] relative overflow-hidden rounded-xl">
                  <img
                    src={base64Src}
                    alt={story.title} // Added alt attribute for accessibility
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
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

                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => onBookSelect(story)} // onClick is correctly placed here
                  >
                    <div className="text-center">
                      <h6 className="text-xl font-semibold">{story.title}</h6>
                      <p className="text-sm">{story.authorName}</p>
                    </div>
                  </div>
                </div>

                {/* Buttons Below the Image */}
                {showAdminActions && (
                  <div className="flex justify-center mt-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs mr-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBook(story.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(story.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PopularBooks;
