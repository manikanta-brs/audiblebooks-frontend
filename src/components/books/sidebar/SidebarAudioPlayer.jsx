import AudioPlayer from "../AudiobookPlayer";
import styles from "./SidebarPlayer.module.css";
import ReactStars from "react-stars";
import {
  useAddUserRatingAPIMutation,
  useAddAuthorRatingAPIMutation,
  // useGetUserRatingQuery,
} from "../../../store/audiobooks/audiobookApiSlice";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import debounce from "lodash.debounce"; // Install lodash.debounce: npm install lodash.debounce

const SidebarPlayer = ({
  audiobook,
  onClose,
  onToggleMaximize,
  isMaximized,
  isOpen,
  userType, // "user" or "author" (this should be passed as a prop)
}) => {
  const [addUserRating, { isLoading: userLoading }] =
    useAddUserRatingAPIMutation();
  const [addAuthorRating, { isLoading: authorLoading }] =
    useAddAuthorRatingAPIMutation();

  const initialAudiobookRating = audiobook?.rating || 0;
  const [newRating, setNewRating] = useState(initialAudiobookRating);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    setNewRating(initialAudiobookRating);
  }, [initialAudiobookRating]);

  const ratingChanged = (newRating) => {
    setNewRating(newRating);
  };

  const submitReview = async () => {
    if (!audiobook?.id) {
      toast.error("Audiobook ID is missing.");
      return;
    }

    if (!userType) {
      toast.error("User type not detected.");
      return;
    }

    try {
      const mutation = userType === "author" ? addAuthorRating : addUserRating;
      await mutation({
        id: audiobook.id,
        rating: newRating,
        review: reviewText,
      }).unwrap();

      toast.success("Rating and review submitted successfully!");
      setReviewText("");
    } catch (error) {
      console.error("Failed to submit rating and review:", error);
      toast.error(
        error?.data?.message || "Failed to submit rating. Please try again."
      );
    }
  };

  // Debounce the submitReview function
  const handleSubmitReview = useCallback(debounce(submitReview, 500), [
    submitReview,
  ]);

  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.active : ""} ${
    isMaximized ? styles.maximized : ""
  }`;

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "10px",
  };

  return (
    <aside className={sidebarClass}>
      <div style={buttonContainerStyle}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close Sidebar"
        >
          X
        </button>
        <button
          className={styles.maximizeButton}
          onClick={onToggleMaximize}
          aria-label={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? "Minimize" : "Maximize"}
        </button>
      </div>

      {isMaximized ? (
        <div className={styles.playerAndDetails}>
          {audiobook && <AudioPlayer audiobook={audiobook} />}
          <div className={styles.bookDetails}>
            <h2>{audiobook?.title}</h2>
            <p>Author: {audiobook?.authorName}</p>
            <div className={styles.ratingContainer}>
              Your Rating:
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                color2={"#ffd700"}
                value={newRating}
                half={false}
              />
            </div>
            <textarea
              className={styles.reviewInput}
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmitReview}
              disabled={userLoading || authorLoading}
              aria-label="Submit Review"
            >
              {userLoading || authorLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {audiobook && <AudioPlayer audiobook={audiobook} />}
          <div className={styles.bookDetailsBelow}>
            <h2>{audiobook?.title}</h2>
            <p>Author: {audiobook?.authorName}</p>
            <div className={styles.ratingContainer}>
              Your Rating:
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                color2={"#ffd700"}
                value={newRating}
                half={false}
              />
            </div>
            <textarea
              className={styles.reviewInput}
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmitReview}
              disabled={userLoading || authorLoading}
              aria-label="Submit Review"
            >
              {userLoading || authorLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default SidebarPlayer;
