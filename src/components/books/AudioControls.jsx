import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
} from "@fortawesome/free-solid-svg-icons"; // Import icon definitions

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  playerType,
}) => (
  <div className={playerType}>
    <button
      type="button"
      className="prev"
      aria-label="Previous"
      onClick={onPrevClick}
    >
      <FontAwesomeIcon icon={faBackward} className="w-5 h-5" />{" "}
      {/* Use FontAwesomeIcon with faBackward */}
    </button>
    {isPlaying ? (
      <button
        type="button"
        className="pause"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        <FontAwesomeIcon icon={faPause} className="w-5 h-5" />{" "}
        {/* Use FontAwesomeIcon with faPause */}
      </button>
    ) : (
      <button
        type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
      >
        <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />{" "}
        {/* Use FontAwesomeIcon with faPlay */}
      </button>
    )}
    <button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
    >
      <FontAwesomeIcon icon={faForward} className="w-5 h-5" />{" "}
      {/* Use FontAwesomeIcon with faForward */}
    </button>
  </div>
);

export default AudioControls;
