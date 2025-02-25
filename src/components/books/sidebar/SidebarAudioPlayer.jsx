import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styles from "./SidebarPlayer.module.css";
import ReactStars from "react-stars";
import {
  useAddUserRatingAPIMutation,
  useAddAuthorRatingAPIMutation,
} from "../../../store/audiobooks/audiobookApiSlice";
import { useAddRatingAPIMutation } from "../../../store/audiobooks/audiobookApiSlice"; // Import the new mutation
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import GifComponent from "./GifComponent";

const SidebarPlayer = ({ audiobook, onClose, userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioSrc, setAudioSrc] = useState("");
  const [loadingError, setLoadingError] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [existingRatingData, setExistingRatingData] = useState(null); // New state

  const [addUserRating, { isLoading: userLoading }] =
    useAddUserRatingAPIMutation();
  const [addAuthorRating, { isLoading: authorLoading }] =
    useAddAuthorRatingAPIMutation();

  const [addRatingAPI, { isLoading: ratingLoading }] = // rename authorLoading and Userloading to ratingLoading for less confusion
    useAddRatingAPIMutation();

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (audiobook && audiobook.id) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [audiobook, audiobook.id]);

  useEffect(() => {
    setNewRating(0);
    setReviewText("");
  }, [audiobook]);

  useEffect(() => {
    const audiobookId = audiobook?.id;
    const localStorageKey = `hasRated_${audiobookId}_${userType}`; // Unique key per book and user type

    if (audiobookId && userType) {
      const storedHasRated = localStorage.getItem(localStorageKey);
      if (storedHasRated) {
        setHasRated(storedHasRated === "true"); // Convert string to boolean
      } else {
        setHasRated(false); // Default to false if not found
      }
    } else {
      setHasRated(false); // Reset if audiobook or userType is missing
    }
  }, [audiobook?.id, userType]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleToggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  const ratingChanged = (newRating) => {
    setNewRating(newRating);
  };

  const submitReview = async () => {
    if (!audiobook?.id) {
      toast.error("Audiobook ID is missing.");
      return;
    }

    try {
      const payload = {
        audiobookId: audiobook.id, // Use audiobookId instead of id
        rating: newRating,
        review: reviewText,
      };

      await addRatingAPI(payload).unwrap(); // Use the imported mutation

      toast.success("Rating and review submitted successfully!");
      // setReviewText(""); // Do not reset right away
      setHasRated(true);

      const localStorageKey = `hasRated_${audiobook?.id}_${userType}`; // Use id from audiobook
      localStorage.setItem(localStorageKey, "true");

      // Store rating and review in local storage
      localStorage.setItem(
        `rating_${audiobook?.id}_${userType}`,
        JSON.stringify({ rating: newRating, review: reviewText })
      );

      //Update ExistingRatingData Immediately After Success
      setExistingRatingData({ rating: newRating, review: reviewText }); // Update existing rating
    } catch (error) {
      console.error("[SidebarPlayer] Error submitting review:", error);

      let errorMessage = "Error submitting rating/review"; //default message

      if (error?.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid data provided.";
      } else if (error?.message === "Network Error") {
        errorMessage =
          "A network error occurred. Please check your connection.";
      } else if (error?.response?.status === 409) {
        //Check for code 409 if there is already rated
        errorMessage = "Already rated this book, try again in sometime";
      }

      toast.error(errorMessage);
    }
  };

  const handleSubmitReview = useCallback(debounce(submitReview, 500), [
    submitReview,
    audiobook?.id,
    newRating,
    reviewText,
  ]);

  const sidebarClass = `${styles.sidebar} ${isOpen ? styles.active : ""} ${
    isMaximized ? styles.maximized : ""
  }`;

  const base64ToBlob = useCallback((base64String, mimeType) => {
    try {
      let rawBase64 = base64String;
      if (base64String.startsWith("data:")) {
        rawBase64 = base64String.split(",")[1]; // Remove "data:..." prefix
      }

      const byteCharacters = atob(rawBase64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });
      return blob;
    } catch (error) {
      console.error("Error converting base64 to Blob:", error);
      return null;
    }
  }, []);

  const { audioBlob, audioBlobUrl } = useMemo(() => {
    let blob = null;
    let blobUrl = "";

    if (audiobook?.audioFileUrl) {
      blobUrl = audiobook.audioFileUrl;
    } else if (audiobook?.audioBase64Data) {
      if (
        !audiobook?.audioBase64Data ||
        audiobook?.audioBase64Data.length === 0
      ) {
        return { audioBlob: null, audioBlobUrl: "" };
      }

      if (typeof audiobook?.audioBase64Data !== "string") {
        return { audioBlob: null, audioBlobUrl: "" };
      }

      try {
        blob = base64ToBlob(audiobook.audioBase64Data, "audio/mpeg");
        if (blob) {
          blobUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error("Error creating audio blob:", error);
      }
    } else {
      console.warn("[SidebarPlayer] No audio URL or base64 data available");
    }

    return { audioBlob: blob, audioBlobUrl: blobUrl };
  }, [audiobook, base64ToBlob]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.src = "";
      audioRef.current.load();
    }
    setAudioSrc(audioBlobUrl);
    setLoadingError(null);
  }, [audiobook, audioBlobUrl]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioSrc && audioElement) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const handleMetadata = () => {
        handleLoadedMetadata();
        setLoadingError(null);
      };

      const handleError = (e) => {
        console.error("Audio loading error:", e);
        console.error("Error code:", e.target.error?.code);
        console.error("Error message:", e.target.error?.message);
        setLoadingError("Error loading audio. Please try again.");
      };

      audioElement.addEventListener("loadedmetadata", handleMetadata);
      audioElement.addEventListener("play", onPlay);
      audioElement.addEventListener("pause", onPause);
      audioElement.addEventListener("error", handleError);

      if (audioSrc) {
        audioElement.src = audioSrc;
      } else {
        console.warn("audioSrc is empty!  Not setting audio source.");
      }

      return () => {
        audioElement.removeEventListener("loadedmetadata", handleMetadata);
        audioElement.removeEventListener("play", onPlay);
        audioElement.removeEventListener("pause", onPause);
        audioElement.removeEventListener("error", handleError);
      };
    }
  }, [audioSrc, handleLoadedMetadata]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [playbackSpeed, isMuted, volume]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      progressRef.current.value = (time / duration) * 100 || 0;
    }
  }, [duration]);

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const base64ImageSrc = useMemo(() => {
    if (audiobook?.coverImageUrl) {
      return `${audiobook.coverImageUrl}`;
    } else if (audiobook?.coverImageData) {
      return `data:image/jpeg;base64,${audiobook.coverImageData}`;
    } else {
      return "./images/image.png";
    }
  }, [audiobook]);

  useEffect(() => {
    return () => {
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
        console.log("Blob URL revoked");
      }
    };
  }, [audioBlobUrl]);

  // ** useEffect TO FETCH RATINGS FROM LOCAL STORAGE **
  useEffect(() => {
    const audiobookId = audiobook?.id;
    const localStorageKey = `rating_${audiobookId}_${userType}`;

    if (audiobookId && userType) {
      const storedRating = localStorage.getItem(localStorageKey);
      if (storedRating) {
        try {
          const parsedRating = JSON.parse(storedRating);
          setHasRated(true);
          setNewRating(parsedRating.rating); // Set existing rating
          setReviewText(parsedRating.review); //Set existing Review
          setExistingRatingData(parsedRating); // Set full rating data
        } catch (error) {
          console.error("Error parsing rating from local storage:", error);
          setHasRated(false);
          setNewRating(0);
          setReviewText("");
          setExistingRatingData(null);
        }
      } else {
        setHasRated(false);
        setNewRating(0);
        setReviewText("");
        setExistingRatingData(null);
      }
    } else {
      setHasRated(false);
      setNewRating(0);
      setReviewText("");
      setExistingRatingData(null);
    }
  }, [audiobook?.id, userType]);

  return (
    <aside
      className={`${sidebarClass} bg-white/30 backdrop-blur-md shadow-lg p-4 rounded-xl`}
    >
      <div className={styles.headerButtons}>
        <button
          className="bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200 px-3 py-1"
          onClick={handleClose}
        >
          <GifComponent />
        </button>
        <button
          className="bg-gray-300 rounded w-20 text-black shadow-xl hover:bg-gray-400 transition-colors duration-200 py-1"
          onClick={handleToggleMaximize}
        >
          {isMaximized ? "Minimize" : "Maximize"}
        </button>
      </div>
      <div className="">
        <div className="flex flex-col items-center justify-center mb-4">
          <h2 className="text-2xl font-bold mb-2 text-black">
            {audiobook?.title}
          </h2>
          <p className="text-white text-sm">
            By{" "}
            <span className="text-blue-300 bg-black p-1 rounded px-2">
              {audiobook?.authorName}
            </span>
          </p>
        </div>
      </div>

      <div
        className={`flex ${
          isMaximized ? "flex-row" : "justify-center items-center"
        }`}
      >
        <div
          className={
            isMaximized
              ? "w-1/2 flex justify-center items-center"
              : "flex justify-center items-center"
          }
        >
          <div
            className="audio-player bg-gradient-to-br from-teal-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center"
            style={{
              width: isMaximized ? "350px" : "250px",
              maxWidth: "100%",
            }}
          >
            {audiobook && (
              <h3
                className={`text-2xl font-semibold mb-2 text-center break-words ${
                  isMaximized
                    ? ""
                    : "truncate w-[200px] overflow-hidden whitespace-nowrap"
                }`}
                title={audiobook.title}
              >
                {audiobook.title}
              </h3>
            )}

            <div className="artwork-container rounded-full overflow-hidden shadow-lg mb-6 border-4 border-teal-300 w-32 h-32">
              <img
                src={base64ImageSrc}
                className="object-cover w-full h-full"
                alt={audiobook?.title || "Audiobook Cover"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "./images/image.png";
                }}
              />
            </div>

            <div className="controls flex items-center justify-around w-full mb-4">
              <button
                onClick={() =>
                  audioRef.current?.[isPlaying ? "pause" : "play"]()
                }
                className="p-3 bg-teal-600 rounded-full"
              >
                <FontAwesomeIcon
                  icon={isPlaying ? faPause : faPlay}
                  className="w-6 h-6"
                />
              </button>
            </div>

            <div className="progress-container w-full flex items-center justify-between mb-4">
              <span className="text-sm">{formatTime(currentTime)}</span>
              <input
                type="range"
                ref={progressRef}
                className="progress w-full h-2 bg-gray-600 rounded-full"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
              />
              <span className="text-sm">{formatTime(duration)}</span>
            </div>

            <div className="volume-control w-full flex items-center justify-between mb-4">
              <button onClick={toggleMute} className="p-2">
                <FontAwesomeIcon
                  icon={isMuted ? faVolumeMute : faVolumeUp}
                  className="w-5 h-5"
                />
              </button>
              <input
                type="range"
                className="w-2/3 h-2 bg-gray-600 rounded-full"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>

            <div className="playback-speed-control mt-2 w-full text-center">
              <label htmlFor="playbackSpeed" className="text-sm">
                Playback Speed:
              </label>
              <select
                id="playbackSpeed"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-gray-700 text-white text-sm rounded-md p-2"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </div>

            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            >
              {audioSrc && <source src={audioSrc} type="audio/mpeg" />}
              <track kind="captions" />
            </audio>

            {loadingError && (
              <div className="text-red-500 mt-2">{loadingError}</div>
            )}
          </div>
        </div>

        {isMaximized && (
          <div className="w-1/2 p-4 flex flex-col justify-start">
            <h3 className="text-lg font-semibold mb-2 text-black">
              Description
            </h3>
            <div className="text-white bg-gray-600 w-full h-32 overflow-auto border border-gray-300 p-2 rounded-md mb-4">
              {audiobook?.description || "No description available."}
            </div>

            <div className="mb-4">
              <p className="text-sm text-black">You rated:</p>
              <ReactStars
                count={5}
                size={24}
                value={existingRatingData?.rating || 0} // Default to 0 if no rating
                edit={false} // Make it read-only
              />
              <div className="mt-2 p-2 bg-gray-200 text-black rounded">
                <p>Your Review:</p>
                <p className="italic">
                  {existingRatingData?.review || "No review given."}
                </p>
              </div>
            </div>
            {/* Always Show The Form */}
            <div className="mt-3">
              <p className="text-sm text-black">Update Your Rating:</p>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={40}
                value={newRating}
              />
            </div>

            <textarea
              className={
                styles.reviewInput +
                " w-full p-2 mt-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              }
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="mt-3 flex justify-center">
              <button
                className={
                  styles.submitButton +
                  " w-96 bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-md"
                }
                onClick={handleSubmitReview}
                disabled={ratingLoading}
              >
                {ratingLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>

      {!isMaximized && (
        <div className={styles.bookDetails}>
          <p className="text-black">Author: {audiobook?.authorName}</p>

          {hasRated ? (
            // Show existing rating and review
            <div>
              <p className="text-sm text-black">You rated:</p>
              <ReactStars
                count={5}
                size={24}
                value={existingRatingData?.rating || 0}
                edit={false}
              />
              <div className="mt-2 p-2 bg-gray-200 text-black rounded">
                <p>Your Review:</p>
                <p className="italic">
                  {existingRatingData?.review || "No review given."}
                </p>
              </div>
            </div>
          ) : (
            // Show rating input and review form
            // <div>
            //   <p className="text-sm text-black w-40 ml-6">Rate this book:</p>
            //   <ReactStars
            //     count={5}
            //     onChange={ratingChanged}
            //     size={24}
            //     value={newRating}
            //   />
            //   <textarea
            //     className={
            //       styles.reviewInput +
            //       " w-96 ml-1 p-2 mt-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            //     }
            //     placeholder="Write a review..."
            //     value={reviewText}
            //     onChange={(e) => setReviewText(e.target.value)}
            //   />
            //   <div className="mt-3 flex justify-center">
            //     <button
            //       className={
            //         styles.submitButton +
            //         " w-96 bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-md"
            //       }
            //       onClick={handleSubmitReview}
            //       disabled={ratingLoading}
            //     >
            //       {ratingLoading ? "Submitting..." : "Submit Review"}
            //     </button>
            //   </div>
            // </div>
            <div className="mt-2">
              <p className="text-sm text-black mb-1">Rate this book:</p>
              <div className="flex justify-center">
                {" "}
                {/* Center stars */}
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24} // Increased star size
                  value={newRating}
                />
              </div>
              <textarea
                className={`${styles.reviewInput} w-full p-2 mt-1 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm`} // Increased padding and text size, change text color to black for better readability
                placeholder="Write a review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="mt-2 flex justify-center">
                <button
                  className={`${styles.submitButton} w-full bg-indigo-600 hover:bg-indigo-800 text-white py-2 rounded-md text-sm`} // Increased padding and text size
                  onClick={handleSubmitReview}
                  disabled={ratingLoading}
                >
                  {ratingLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default SidebarPlayer;
