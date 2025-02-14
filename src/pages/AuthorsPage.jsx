import React from "react";
import { Link } from "react-router-dom";
import { useGetAuthorsAPIQuery } from "../store/user/authorApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthorsPage = () => {
  const { data: authors = [], error, isLoading } = useGetAuthorsAPIQuery();
  // get current user id or author id form local storage
  const userData = localStorage.getItem("userData");
  const currentUserId = userData ? JSON.parse(userData)._id : null;
  console.log("currentUserId", currentUserId);

  // filter authors dont have this user id
  const filteredAuthors = authors.filter(
    (author) => author._id !== currentUserId
  );
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-16">Error fetching authors.</p>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Discover Authors</h2>

      {filteredAuthors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAuthors.map((author) => (
            <Link
              to={`/authors/${author._id}`}
              key={author._id}
              className="group"
            >
              <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={author.avatar}
                    alt={`${author.first_name} ${author.last_name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/4322/4322991.png";
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h6 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors duration-200">
                    {author.first_name} {author.last_name}
                  </h6>
                  <p className="text-sm text-gray-500">
                    {author.bio || "Author & Storyteller"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-16">No authors found.</p>
      )}
    </div>
  );
};

export default AuthorsPage;
