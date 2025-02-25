// src/hooks/usePlayback.js
import { useState, useEffect } from "react";

const usePlayback = (audiobookId) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const localStorageKey = `playbackTime-${audiobookId}`;

  useEffect(() => {
    // Load from localStorage on initial load
    const storedTime = localStorage.getItem(localStorageKey);
    if (storedTime) {
      setCurrentTime(parseFloat(storedTime));
    }
  }, [audiobookId]);

  useEffect(() => {
    // Save to localStorage when currentTime changes
    localStorage.setItem(localStorageKey, currentTime.toString());
  }, [currentTime, audiobookId]);

  return { currentTime, setCurrentTime, isPlaying, setIsPlaying };
};

export default usePlayback;
