import { useEffect, useRef } from "react";

const AudioPreview = ({
  url,
  isPlaying,
}: {
  url: string;
  isPlaying: boolean;
}) => {
  const audioRef = useRef(new Audio(url));
  audioRef.current.volume = 0.5;
  const intervalRef = useRef();
  useEffect(() => {
    const currentAudio = audioRef.current;
    const currentInterval = intervalRef.current;
    // Pause and clean up on unmount
    return () => {
      currentAudio.pause();
      clearInterval(currentInterval);
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
