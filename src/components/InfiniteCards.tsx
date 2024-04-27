import { useState } from "react";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { head, last, map, pluck, propEq, reject } from "ramda";
import iterateStep from "../utils/iterateStep";
import useRecommenderStore from "../utils/useRecommenderStore";
import SwipeIndicator from "./SwipeIndicator";
import TrackCard from "./TrackCard";
import { usePlausible } from "next-plausible";

const SWIPE_MIN = 100;
const filterRecommendations = (state) => {
  return map(reject(propEq("preview_url", null)))(state.recommendations);
};

const InfiniteCards = ({
  seedTracks,
}: {
  seedTracks: SpotifyApi.TrackObjectFull[];
}) => {
  const plausible = usePlausible();
  const { addChosenTrack, step } = useRecommenderStore();
  const recommendations = useRecommenderStore(filterRecommendations);

  const [cardAt, setCardAt] = useState(2);
  const [recommendationAt, setRecommendationAt] = useState(0);
  const [cards, setCards] = useState([seedTracks[1], seedTracks[0]]);

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

  const setNextCards = (nextStep) => {
    if (
      nextStep === "Second" &&
      recommendations.length &&
      head(recommendations).length > recommendationAt
    ) {
      setCards([
        head(recommendations)[recommendationAt],
        ...cards.slice(0, cards.length - 1),
      ]);
      setRecommendationAt(recommendationAt + 1);
    } else if (
      nextStep === "Third" &&
      recommendations.length &&
      last(recommendations).length > recommendationAt
    ) {
      setCards([
        last(recommendations)[recommendationAt],
        ...cards.slice(0, cards.length - 1),
      ]);
      setRecommendationAt(recommendationAt + 1);
    } else if (cardAt < seedTracks.length) {
      setCards([seedTracks[cardAt], ...cards.slice(0, cards.length - 1)]);
    } else {
      setCards([...cards.slice(0, cards.length - 1)]);
    }
  };

  const onDirectionLock = (axis: string) =>
    setDragStart({ ...dragStart, axis: axis });

  const animateCardSwipe = (animation: { x: number; y: number }, nextStep) => {
    setDragStart({ ...dragStart, animation });
    setTimeout(() => {
      setDragStart({ axis: "null", animation: { x: 0, y: 0 } });
      x.set(0);
      setNextCards(nextStep);
      setCardAt(cardAt + 1);
    }, 300);
  };

  const onDragEnd = (info, card) => {
    if (info.offset.x >= SWIPE_MIN) {
      plausible("selectTrack");
      setRecommendationAt(0);
      const nextStep = iterateStep();
      animateCardSwipe({ x: SWIPE_MIN * 2, y: 0 }, nextStep);
      addChosenTrack(card);
    } else if (info.offset.x <= -SWIPE_MIN) {
      plausible("rejectTrack");
      animateCardSwipe({ x: -SWIPE_MIN * 2, y: 0 }, step);
    }
  };

  const renderCards = () => {
    return cards.map((card, index) => {
      if (index === cards.length - 1) {
        return (
          <TrackCard
            drag="x"
            card={card}
            key={card?.id}
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
            key={card?.id}
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
    <div className="grid grid-rows-layout overflow-hidden">
      <>
        <SwipeIndicator x={x} swipeMin={SWIPE_MIN} />
      </>
      <motion.div
        className="grid min-h-0 min-w-0 grid-cols-1 grid-rows-[minmax(0,1fr)]"
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ ease: "easeOut", duration: 1, delay: 0.5 }}
      >
        {cards.length ? (
          renderCards()
        ) : (
          <div className="self-center p-4 text-center font-semibold text-white">
            <p>Oh no, we&apos;ve run out of suggestions</p>

            <p>Please click to refresh and start again</p>
            <button
              className="p-4 text-4xl"
              onClick={() => {
                plausible("refresh");
                window.location.reload();
              }}
            >
              🔃
            </button>
          </div>
        )}
      </motion.div>
      {cards.length ? (
        <div className="m-4 p-4 text-center font-semibold">
          <h1 className="text-lg text-white">{last(cards).name}</h1>
          <h3 className="text-[#e3e1e4]">
            {pluck("name")(last(cards).artists).join(", ")}
          </h3>
          <a
            className="flex justify-center gap-2 p-4 text-[white]"
            href={last(cards).uri}
          >
            <img className="h-6" src="/spotify-white.png" alt="Spotify logo" />
            OPEN SPOTIFY
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default InfiniteCards;
