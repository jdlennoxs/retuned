import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { TrackListing } from "./TrackListing";

const TrackCard = ({
  card,
  style,
  onDirectionLock,
  onDragEnd,
  animate,
  drag,
}) => {
  return (
    <motion.div
      className="absolute w-72 place-items-center overflow-hidden rounded-2xl shadow-lg md:h-[480px] md:w-[480px]"
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      dragDirectionLock
      onDirectionLock={onDirectionLock}
      onDragEnd={onDragEnd}
      animate={animate}
      style={{ ...style }}
      transition={{ ease: [0.6, 0.05, -0.01, 0.9] }}
      whileTap={{ scale: 0.85 }}
    >
      <TrackListing track={card} key={card.id} />
    </motion.div>
  );
};

export default TrackCard;
