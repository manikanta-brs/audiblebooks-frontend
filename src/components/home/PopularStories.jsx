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
              : story.coverImageUrl || "./images/default-book-cover.png";
            const rating = story.rating || 0;

            return (
              <div
                className="mb-6 p-2 rounded-lg group relative overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-xl bg-white"
                key={story.id}
              >
                {/* Image Container with Reduced Height */}
                <div className="aspect-[5/7] relative overflow-hidden rounded-lg">
                  <img
                    src={base64Src}
                    alt={story.title}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Star Rating - Always Visible */}
                  <div className="absolute top-2 left-2 bg-black/80 p-1 rounded-md backdrop-blur-sm z-10">
                    <ReactStars
                      count={5}
                      size={18}
                      color2={"#ffd700"}
                      half={true}
                      value={rating}
                      edit={false}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => onBookSelect(story)}
                  >
                    <div className="text-center">
                      <h6 className="text-lg font-semibold">{story.title}</h6>
                      <p className="text-sm">{story.authorName}</p>
                      {/* Display a GIF */}
                      <img
                        src="/src/components/home/audio.gif" // Make sure this path is correct
                        alt="Reading"
                        className="w-20 h-20 mx-auto mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Buttons */}
                {showAdminActions && (
                  <div className="flex justify-center mt-2 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded text-xs transition-all duration-200 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBook(story.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded text-xs transition-all duration-200 hover:scale-105"
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
