import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingSpinner from "../LoadingSpinner";
import PopularBooks from "../home/PopularStories";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer.jsx";
import SearchBar from "../home/SearchBar.jsx";
import styles from "./MyAudiobooks.module.css";
import {
  useGetAudiobooksAPIQuery,
  useDeleteAudiobookAPIMutation,
  useUpdateAudiobookAPIMutation,
} from "../../store/audiobooks/audiobookApiSlice.js";

const MyAudiobooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [audiobookToEdit, setAudiobookToEdit] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //const [isLoading, setIsLoading] = useState(true); REMOVE THIS

  const { userData, isAuthorLogin } = useSelector((state) => state.auth);
  const authorId = userData?.profileData?._id;
  const userType = isAuthorLogin ? "author" : "user";

  const {
    data: audiobooksData,
    isError,
    isLoading, // Using the Redux isLoading
    refetch,
  } = useGetAudiobooksAPIQuery(authorId);

  const [deleteAudiobook, { isLoading: isDeleteLoading }] =
    useDeleteAudiobookAPIMutation();
  const [updateAudiobook, { isLoading: isUpdateLoading }] =
    useUpdateAudiobookAPIMutation();

  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
    setAudiobookToEdit(null);
  }, []);

  const handleUpdateAudiobook = useCallback(
    async (updatedBook) => {
      try {
        const formData = new FormData();
        formData.append("title", updatedBook.title);
        formData.append("description", updatedBook.description);

        if (updatedBook.image) {
          formData.append("image", updatedBook.image);
        }

        if (updatedBook.audiobook) {
          formData.append("audiobook", updatedBook.audiobook);
        }

        await updateAudiobook({
          id: updatedBook.id,
          data: formData,
        }).unwrap();

        toast.success("Audiobook updated successfully!");
        closeModal();
        refetch();
      } catch (error) {
        console.error("Failed to update audiobook:", error);
        toast.error(
          error?.data?.message ||
            "Failed to update audiobook. Please try again."
        );
      }
    },
    [updateAudiobook, refetch, closeModal]
  );

  const handleBookSelect = useCallback((book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedAudiobook(null);
    setIsSidebarMaximized(false);
    setIsSidebarOpen(false);
  }, []);

  const handleToggleMaximize = () => {
    setIsSidebarMaximized((prev) => !prev);
  };

  const handleEditBook = useCallback(
    (bookId) => {
      const bookToEdit = filteredBooks.find((book) => book.id === bookId);
      if (bookToEdit) {
        setAudiobookToEdit(bookToEdit);
        setIsEditModalOpen(true);
      }
    },
    [filteredBooks]
  );

  const handleDeleteBook = useCallback(
    async (bookId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteAudiobook(bookId).unwrap();
            setFilteredBooks((prevBooks) =>
              prevBooks.filter((book) => book.id !== bookId)
            );
            Swal.fire("Deleted!", "Audiobook deleted successfully!", "success");
          } catch (error) {
            console.error("Failed to delete audiobook:", error);
            Swal.fire(
              "Error",
              error?.data?.message ||
                "Failed to delete audiobook. Please try again.",
              "error"
            );
          } finally {
            refetch();
          }
        }
      });
    },
    [deleteAudiobook, refetch]
  );

  useEffect(() => {
    // Filter books logic (moved inside useEffect)
    if (audiobooksData) {
      let filtered = audiobooksData.filter((book) => book.author === authorId);

      if (searchQuery) {
        filtered = filtered.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredBooks(filtered);
    } else {
      setFilteredBooks([]);
    }
  }, [audiobooksData, authorId, searchQuery]);

  return (
    <div className={styles.myAudiobooksContainer}>
      {/* SidebarPlayer */}
      {isSidebarOpen && selectedAudiobook && (
        <SidebarPlayer
          audiobook={selectedAudiobook}
          onClose={handleCloseSidebar}
          onToggleMaximize={handleToggleMaximize}
          isMaximized={isSidebarMaximized}
          userType={userType}
        />
      )}

      {/* Content */}
      <div className={styles.content}>
        <h2 className="text-2xl text-white font-semibold mb-4">My Books</h2>
        <SearchBar setSearchQuery={setSearchQuery} />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-64 bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-red-700 text-lg font-semibold">
              Error loading books.
            </p>
          </div>
        ) : (
          <section>
            {!filteredBooks || filteredBooks.length === 0 ? (
              <div className="flex justify-center items-center h-64 bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-green-700 text-lg font-semibold">
                  No books found.
                </p>
              </div>
            ) : (
              <PopularBooks
                stories={filteredBooks}
                onBookSelect={handleBookSelect}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
                showAdminActions={true}
              />
            )}
          </section>
        )}
      </div>

      {/* Edit Audiobook Modal */}
      {isEditModalOpen && audiobookToEdit && (
        <EditAudiobookModal
          key={audiobookToEdit.id}
          audiobook={audiobookToEdit}
          onClose={closeModal}
          onUpdate={handleUpdateAudiobook}
        />
      )}
    </div>
  );
};

// EditAudiobookModal Component
function EditAudiobookModal({ audiobook, onClose, onUpdate }) {
  const [title, setTitle] = useState(audiobook?.title || "");
  const [description, setDescription] = useState(audiobook?.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      id: audiobook.id,
      title,
      description,
    };

    try {
      await onUpdate(updatedBook);
      onClose();
    } catch (error) {
      console.error("Failed to update audiobook:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Audiobook</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default MyAudiobooks;
