import LoadingSpinner from "../LoadingSpinner";
import PopularBooks from "../home/PopularStories";
import {
  useGetAudiobooksAPIQuery,
  useDeleteAudiobookAPIMutation,
  useUpdateAudiobookAPIMutation,
} from "../../store/audiobooks/audiobookApiSlice.js";
import { useSelector } from "react-redux";
import SidebarPlayer from "../books/sidebar/SidebarAudioPlayer.jsx";
import styles from "./MyAudiobooks.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const MyAudiobooks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudiobook, setSelectedAudiobook] = useState(null);
  const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [audiobookToEdit, setAudiobookToEdit] = useState(null);

  const { userData, isLoggedIn, isAuthorLogin } = useSelector(
    (state) => state.auth
  );
  const authorId = userData?.profileData?._id;

  const {
    data: audiobooksData,
    isError,
    isLoading: isAudiobooksLoading,
    refetch, // Add refetch here
  } = useGetAudiobooksAPIQuery(authorId);

  const [
    deleteAudiobook,
    { isLoading: isDeleteLoading, isError: isDeleteError },
  ] = useDeleteAudiobookAPIMutation();
  const [
    updateAudiobook,
    { isLoading: isUpdateLoading, isError: isUpdateError },
  ] = useUpdateAudiobookAPIMutation();
  // console.log("audiobooksData:", audiobooksData);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsLoading(isAudiobooksLoading);
    if (audiobooksData?.length) {
      setFilteredBooks(
        audiobooksData.filter((book) => book.author === authorId)
      );
    } else {
      setFilteredBooks([]);
      setSelectedAudiobook(null);
    }
  }, [audiobooksData, authorId, isAudiobooksLoading]);

  const handleBookSelect = (book) => {
    setSelectedAudiobook(book);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedAudiobook(null);
    setIsSidebarMaximized(false);
    setIsSidebarOpen(false);
  };

  const handleToggleMaximize = () => {
    setIsSidebarMaximized(!isSidebarMaximized);
  };

  const handleEditBook = (bookId) => {
    console.log("handleEditBook called with bookId:", bookId); // Add this line
    const bookToEdit = filteredBooks.find((book) => book.id === bookId);
    console.log("Book to edit:", bookToEdit); // Add this line
    if (bookToEdit) {
      setAudiobookToEdit(bookToEdit);
      setIsEditModalOpen(true);
      console.log(`Editing book with ID: ${bookId}`);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteAudiobook(bookId).unwrap();
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );
      toast("Audiobook deleted successfully!");
    } catch (error) {
      console.error("Failed to delete audiobook:", error);
      toast("Failed to delete audiobook. Please try again.");
    }
  };

  const handleUpdateAudiobook = async (updatedBook) => {
    console.log("handleUpdateAudiobook called with:", updatedBook);

    try {
      // Create a FormData object
      const formData = new FormData();

      // Append updated fields to the FormData object
      if (updatedBook.title) {
        formData.append("title", updatedBook.title);
      }
      if (updatedBook.description) {
        formData.append("description", updatedBook.description);
      }
      if (updatedBook.image) {
        formData.append("image", updatedBook.image);
      }
      if (updatedBook.audiobook) {
        formData.append("audiobook", updatedBook.audiobook);
      }

      // Log FormData for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`FormData Key: ${key}, Value:`, value);
      }

      // Call the mutation with FormData
      await updateAudiobook({
        id: updatedBook.id,
        data: formData,
      }).unwrap();

      toast.success("Audiobook updated successfully!");
      refetch(); // Refetch the data
    } catch (error) {
      console.error("Failed to update audiobook:", error);
      toast.error("Failed to update audiobook. Please try again.");
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setAudiobookToEdit(null);
  };
  function EditAudiobookModal({ audiobook, onClose, onUpdate }) {
    const [title, setTitle] = useState(audiobook.title || "");
    const [description, setDescription] = useState(audiobook.description || "");

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Create an updatedBook object
      const updatedBook = {
        id: audiobook.id,
        title,
        description,
      };

      // Call the update function with the updatedBook object
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
  return (
    <div className={styles.myAudiobooksContainer}>
      <SidebarPlayer
        audiobook={selectedAudiobook}
        onClose={handleCloseSidebar}
        onToggleMaximize={handleToggleMaximize}
        isMaximized={isSidebarMaximized}
        isOpen={isSidebarOpen}
      />
      <div className={styles.content}>
        <h2 className="text-2xl text-white font-semibold mb-4">My Books</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-screen-md p-2 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Centering the LoadingSpinner */}
        {/* {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <section>
            <PopularBooks
              stories={filteredBooks}
              onBookSelect={handleBookSelect}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              showAdminActions={true}
            />
          </section>
        )} */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
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

      {isEditModalOpen && (
        <EditAudiobookModal
          key={audiobookToEdit?.id}
          audiobook={audiobookToEdit}
          onClose={closeModal}
          onUpdate={handleUpdateAudiobook}
        />
      )}
    </div>
  );
};

export default MyAudiobooks;
