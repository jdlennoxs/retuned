import { useState } from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { last, pluck } from "ramda";
import iterateStep from "../utils/iterateStep";
import useRecommenderStore from "../utils/useRecommenderStore";
import SwipeIndicator from "./SwipeIndicator";
import TrackCard from "./TrackCard";

const SWIPE_MIN = 100;

const InfiniteCards = ({
  tracks,
  // recommendations = [],
  getRecommendations,
}: {
  tracks: any[];
  recommendations: SpotifyApi.RecommendationTrackObject[];
  getRecommendations: any;
}) => {
  const { addChosenTrack, step, setStep, recommendations } =
    useRecommenderStore();
  const [cardAt, setCardAt] = useState(3);
  const [cards, setCards] = useState([tracks[2], tracks[1], tracks[0]]);

  const getRecommendationsForStep = () => {
    console.log(step);
    if (step === "First" || step === "Start" || step === "Third") {
      getRecommendations();
    }
  };

  // useEffect(() => {
  //   tracks.splice(cardAt, 0, ...recommendations);
  // }, [recommendations, tracks]);

  const [dragStart, setDragStart] = useState({
    axis: "null",
    animation: { x: 0, y: 0 },
  });

  const x = useMotionValue(0);
  const scale = useTransform(x, [-SWIPE_MIN, 0, SWIPE_MIN], [1, 0.5, 1]);
  const cardOpacity = useTransform(
    x,
    [-SWIPE_MIN * 2, -SWIPE_MIN, 0, SWIPE_MIN, SWIPE_MIN * 2],
    [0, 1, 1, 1, 0]
  );
  const onDirectionLock = (axis: string) =>
    setDragStart({ ...dragStart, axis: axis });
  const animateCardSwipe = (animation: { x: number; y: number }) => {
    setDragStart({ ...dragStart, animation });
    setTimeout(() => {
      setDragStart({ axis: "null", animation: { x: 0, y: 0 } });
      x.set(0);
      setCards([tracks[cardAt], ...cards.slice(0, cards.length - 1)]);
      setCardAt(cardAt + 1);
    }, 400);
  };

  const onDragEnd = (info, card) => {
    if (info.offset.x >= SWIPE_MIN) {
      animateCardSwipe({ x: SWIPE_MIN * 2, y: 0 });
      addChosenTrack(card);
      iterateStep({ step, setStep });
      setTimeout(() => getRecommendationsForStep(), undefined);
    } else if (info.offset.x <= -SWIPE_MIN)
      animateCardSwipe({ x: -SWIPE_MIN * 2, y: 0 });
  };

  const renderCards = () => {
    return cards.map((card, index) => {
      if (index === cards.length - 1) {
        return (
          <TrackCard
            drag="x"
            card={card}
            key={card.id}
            style={{
              x,
              zIndex: index,
              touchAction: "none",
              opacity: cardOpacity,
            }}
            onDirectionLock={(axis) => onDirectionLock(axis)}
            onDragEnd={(e, info) => onDragEnd(info, card)}
            animate={dragStart.animation}
          />
        );
      } else
        return (
          <TrackCard
            card={card}
            key={card.id}
            style={{
              scale,
              zIndex: index,
            }}
            animate={{ opacity: 1, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.5 }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        );
    });
  };

  return (
    <div className="relative z-20 m-auto flex justify-center">
      <motion.div
        className="flex justify-center"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ ease: "easeOut", duration: 1, delay: 1 }}
      >
        {renderCards()}
      </motion.div>
      <div className="fixed top-16 justify-center">
        <SwipeIndicator x={x} swipeMin={SWIPE_MIN} />
      </div>
      <div className="fixed bottom-16 z-0 text-center">
        <h1 className="text-lg font-semibold text-white">{last(cards).name}</h1>
        <h3 className="font-semibold text-[#e3e1e4]">
          {pluck("name")(last(cards).artists).join(", ")}
        </h3>
      </div>
    </div>
  );
};

export default InfiniteCards;
