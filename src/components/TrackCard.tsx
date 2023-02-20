/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useState } from "react";
import AudioPreview from "./AudioPreview";

interface CardProps {
  card: any;
  style: any;
  onDirectionLock?: any;
  onDragEnd?: any;
  animate?: any;
  drag?: any;
  initial?: any;
  transition?: any;
}

const getImageSize = (images: SpotifyApi.ImageObject[], size = 640) => {
  const img = images.find((image) => image.height === size) || images[0];
  return img?.url || "";
};

const TrackCard = ({
  card,
  style,
  onDirectionLock,
  onDragEnd,
  animate,
  drag,
  initial,
  transition,
}: CardProps) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  return (
    <motion.div
      className="absolute flex h-[80vh] w-screen"
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      dragDirectionLock
      onDirectionLock={onDirectionLock}
      onDragEnd={onDragEnd}
      animate={animate}
      style={{ ...style }}
      transition={{ ease: [0.6, 0.05, -0.01, 0.9], ...transition }}
      whileTap={{ scale: 0.85 }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
      initial={initial}
    >
      <div className={"relative m-auto place-items-center p-2"}>
        {card.preview_url && (
          <AudioPreview isPlaying={isPointerDown} url={card.preview_url} />
        )}
        <img
          className="object pointer-events-none overflow-hidden shadow-lg"
          height={480}
          width={480}
          src={getImageSize(card.album.images)}
          alt=""
        />
      </div>
    </motion.div>
  );
};

export default TrackCard;
