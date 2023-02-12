import { motion } from "framer-motion";
import { useState } from "react";
import { TrackListing } from "./TrackListing";

interface CardProps {
  card: any;
  style: any;
  onDirectionLock?: any;
  onDragEnd?: any;
  animate?: any;
  drag?: any;
}

const TrackCard = ({
  card,
  style,
  onDirectionLock,
  onDragEnd,
  animate,
  drag,
}: CardProps) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  return (
    <motion.div
      className="absolute flex h-screen w-screen"
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      dragDirectionLock
      onDirectionLock={onDirectionLock}
      onDragEnd={onDragEnd}
      animate={animate}
      style={{ ...style }}
      transition={{ ease: [0.6, 0.05, -0.01, 0.9] }}
      whileTap={{ scale: 0.85 }}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
    >
      <TrackListing track={card} key={card.id} isPlaying={isPointerDown} />
    </motion.div>
  );
};

export default TrackCard;
