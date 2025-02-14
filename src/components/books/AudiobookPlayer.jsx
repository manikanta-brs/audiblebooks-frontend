// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlay,
//   faPause,
//   faVolumeMute,
//   faVolumeUp,
// } from "@fortawesome/free-solid-svg-icons";

// const AudioPlayer = ({ audiobook }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [audioSrc, setAudioSrc] = useState("");
//   const audioRef = useRef(null);
//   const progressRef = useRef(null);

//   const handleLoadedMetadata = useCallback(() => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   }, []);

//   const audioDataUrl = useMemo(() => {
//     if (audiobook && audiobook.audioBase64Data) {
//       const base64Data = audiobook.audioBase64Data;
//       const contentType = "audio/mpeg";
//       return `data:${contentType};base64,${base64Data}`;
//     }
//     return "";
//   }, [audiobook]);

//   useEffect(() => {
//     setAudioSrc(audioDataUrl);
//   }, [audioDataUrl]);

//   useEffect(() => {
//     if (audioSrc && audioRef.current) {
//       audioRef.current.src = audioSrc;
//       audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
//       audioRef.current.addEventListener("error", (e) =>
//         console.error("Audio loading error:", e)
//       );
//       return () => {
//         if (audioRef.current) {
//           audioRef.current.removeEventListener(
//             "loadedmetadata",
//             handleLoadedMetadata
//           );
//           audioRef.current.removeEventListener("error", (e) =>
//             console.error("Audio loading error:", e)
//           );
//         }
//       };
//     }
//   }, [audioSrc, handleLoadedMetadata]);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.playbackRate = playbackSpeed;
//       audioRef.current.muted = isMuted;
//       audioRef.current.volume = volume;
//     }
//   }, [playbackSpeed, isMuted, volume]);

//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//       updateProgressBar();
//     }
//   };

//   const handleSeek = (e) => {
//     const seekTime = parseFloat(e.target.value);
//     if (audioRef.current) {
//       audioRef.current.currentTime = seekTime;
//       setCurrentTime(seekTime);
//       updateProgressBar();
//     }
//   };

//   const updateProgressBar = () => {
//     if (audioRef.current && progressRef.current) {
//       const progress = (currentTime / duration) * 100;
//       progressRef.current.value = progress || 0;
//     }
//   };

//   const formatTime = (time) => {
//     if (isNaN(time)) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const handlePlaybackSpeedChange = (e) => {
//     setPlaybackSpeed(parseFloat(e.target.value));
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   const handleVolumeChange = (e) => {
//     setVolume(parseFloat(e.target.value));
//   };

//   // Construct base64 image source string for cover image
//   const base64ImageSrc = audiobook?.coverImageData
//     ? `data:image/jpeg;base64,${audiobook.coverImageData}`
//     : "./images/image.png"; // Default placeholder if no cover image

//   return (
//     <div
//       className="audio-player bg-gradient-to-br from-teal-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-md"
//       style={{ maxHeight: "50rem" }}
//     >
//       {/* Audiobook Title */}
//       {audiobook && (
//         <h3 className="text-2xl font-semibold mb-2 text-center text-gray-100">
//           {audiobook.title}
//         </h3>
//       )}

//       {/* Artwork Container */}
//       <div className="artwork-container rounded-full overflow-hidden shadow-lg mb-6 border-4 border-teal-300 w-32 h-32">
//         <img
//           src={base64ImageSrc}
//           className="artwork object-cover w-full h-full transition-transform transform hover:scale-110"
//           alt={audiobook.title}
//         />
//       </div>

//       {/* Play/Pause Controls */}
//       <div className="controls flex items-center justify-around w-full mb-4">
//         <button
//           onClick={togglePlay}
//           className="control-button p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full focus:outline-none shadow-md transform transition duration-300 hover:scale-110"
//           aria-label={isPlaying ? "Pause" : "Play"}
//         >
//           <FontAwesomeIcon
//             icon={isPlaying ? faPause : faPlay}
//             className="w-6 h-6"
//           />
//         </button>
//       </div>

//       {/* Progress Bar and Time */}
//       <div className="progress-container w-full flex items-center justify-between mb-4">
//         <span className="current-time text-sm text-gray-300">
//           {formatTime(currentTime)}
//         </span>
//         <input
//           type="range"
//           ref={progressRef}
//           className="progress w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer mx-2"
//           min="0"
//           max="100"
//           value={(currentTime / duration) * 100 || 0}
//           onChange={handleSeek}
//         />
//         <span className="duration text-sm text-gray-300">
//           {formatTime(duration)}
//         </span>
//       </div>

//       {/* Volume Control */}
//       <div className="volume-control w-full flex items-center justify-between mb-4">
//         <button
//           onClick={toggleMute}
//           className="control-button p-2 text-green-200 hover:text-white focus:outline-none"
//           aria-label={isMuted ? "Unmute" : "Mute"}
//         >
//           <FontAwesomeIcon
//             icon={isMuted ? faVolumeMute : faVolumeUp}
//             className="w-5 h-5"
//           />
//         </button>
//         <input
//           type="range"
//           id="volume"
//           className="w-2/3 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer ml-2"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={handleVolumeChange}
//         />
//       </div>

//       {/* Playback Speed Control */}
//       <div className="playback-speed-control mt-2 w-full text-center">
//         <label htmlFor="playbackSpeed" className="text-sm text-gray-300 mb-2">
//           Playback Speed:
//         </label>
//         <select
//           id="playbackSpeed"
//           value={playbackSpeed}
//           onChange={handlePlaybackSpeedChange}
//           className="bg-gray-700 text-white text-sm rounded-md p-2 focus:outline-none shadow-lg transform transition duration-200 hover:scale-105"
//         >
//           <option value="0.5">0.5x</option>
//           <option value="0.75">0.75x</option>
//           <option value="1">1x</option>
//           <option value="1.25">1.25x</option>
//           <option value="1.5">1.5x</option>
//           <option value="2">2x</option>
//         </select>
//       </div>

//       {/* Audio Element */}
//       <audio
//         ref={audioRef}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//         onPlay={() => setIsPlaying(true)}
//         onPause={() => setIsPlaying(false)}
//         onEnded={() => setIsPlaying(false)}
//         onError={(e) => console.error("Audio loading error:", e)}
//       >
//         {audioSrc && <source src={audioSrc} type="audio/mpeg" />}
//         <track kind="captions" />
//       </audio>
//     </div>
//   );
// };

// export default AudioPlayer;
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

const AudioPlayer = ({ audiobook }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioSrc, setAudioSrc] = useState("");
  const [hasAudioLoaded, setHasAudioLoaded] = useState(false); // New state
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const audioDataUrl = useMemo(() => {
    if (audiobook && audiobook.audioBase64Data) {
      const base64Data = audiobook.audioBase64Data;
      const contentType = "audio/mpeg";
      return `data:${contentType};base64,${base64Data}`;
    }
    return "";
  }, [audiobook]);

  // useEffect(() => {
  //   // Conditionally set audio source only when the component is mounted
  //   if (audiobook && !hasAudioLoaded) {
  //     setAudioSrc(audioDataUrl);
  //     setHasAudioLoaded(true);
  //   }
  // }, [audiobook, audioDataUrl, hasAudioLoaded]);
  useEffect(() => {
    console.log("audiobook:", audiobook); // Log the audiobook prop

    if (audiobook && !hasAudioLoaded) {
      console.log("audioDataUrl inside useEffect:", audioDataUrl); // Log the audioDataUrl
      setAudioSrc(audioDataUrl);
      setHasAudioLoaded(true);
    }
  }, [audiobook, audioDataUrl, hasAudioLoaded]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("error", (e) =>
        console.error("Audio loading error:", e)
      );
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          audioRef.current.removeEventListener("error", (e) =>
            console.error("Audio loading error:", e)
          );
        }
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      updateProgressBar();
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      updateProgressBar();
    }
  };

  const updateProgressBar = () => {
    if (audioRef.current && progressRef.current) {
      const progress = (currentTime / duration) * 100;
      progressRef.current.value = progress || 0;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlaybackSpeedChange = (e) => {
    setPlaybackSpeed(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // Construct base64 image source string for cover image
  const base64ImageSrc = audiobook?.coverImageData
    ? `data:image/jpeg;base64,${audiobook.coverImageData}`
    : "./images/image.png"; // Default placeholder if no cover image

  return (
    <div
      className="audio-player bg-gradient-to-br from-teal-500 to-blue-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-md"
      style={{ maxHeight: "50rem" }}
    >
      {/* Audiobook Title */}
      {audiobook && (
        <h3 className="text-2xl font-semibold mb-2 text-center text-gray-100">
          {audiobook.title}
        </h3>
      )}

      {/* Artwork Container */}
      <div className="artwork-container rounded-full overflow-hidden shadow-lg mb-6 border-4 border-teal-300 w-32 h-32">
        <img
          src={base64ImageSrc}
          className="artwork object-cover w-full h-full transition-transform transform hover:scale-110"
          alt={audiobook.title}
        />
      </div>

      {/* Play/Pause Controls */}
      <div className="controls flex items-center justify-around w-full mb-4">
        <button
          onClick={togglePlay}
          className="control-button p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full focus:outline-none shadow-md transform transition duration-300 hover:scale-110"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Progress Bar and Time */}
      <div className="progress-container w-full flex items-center justify-between mb-4">
        <span className="current-time text-sm text-gray-300">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          ref={progressRef}
          className="progress w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer mx-2"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
        <span className="duration text-sm text-gray-300">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume Control */}
      <div className="volume-control w-full flex items-center justify-between mb-4">
        <button
          onClick={toggleMute}
          className="control-button p-2 text-green-200 hover:text-white focus:outline-none"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <FontAwesomeIcon
            icon={isMuted ? faVolumeMute : faVolumeUp}
            className="w-5 h-5"
          />
        </button>
        <input
          type="range"
          id="volume"
          className="w-2/3 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer ml-2"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Playback Speed Control */}
      <div className="playback-speed-control mt-2 w-full text-center">
        <label htmlFor="playbackSpeed" className="text-sm text-gray-300 mb-2">
          Playback Speed:
        </label>
        <select
          id="playbackSpeed"
          value={playbackSpeed}
          onChange={handlePlaybackSpeedChange}
          className="bg-gray-700 text-white text-sm rounded-md p-2 focus:outline-none shadow-lg transform transition duration-200 hover:scale-105"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.error("Audio loading error:", e)}
      >
        {audioSrc && <source src={audioSrc} type="audio/mpeg" />}
        <track kind="captions" />
      </audio>
    </div>
  );
};

export default AudioPlayer;
