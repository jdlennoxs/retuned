import React, { useState, useEffect, useRef } from "react";

const AudioPreview = ({ url, isPlaying }) => {
  const audioRef = useRef(new Audio(url));
  const intervalRef = useRef();
  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return <></>;
};

export default AudioPreview;
