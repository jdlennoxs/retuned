import React, { useState, useContext, useEffect } from "react";

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import TrackCard from "./TrackCard";
import { last, pluck, tail } from "ramda";

const SWIPE_MIN = 250;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const InfiniteCards = ({ tracks = [] }) => {
  // const [trackArray, setTrackArray] = useState([]);
  // useEffect(
  //   function () {
  //     setTrackArray(shuffleArray(tracks));
  //   },
  //   [tracks]
  // );

  const [cardAt, setCardAt] = useState(3);
  const [cards, setCards] = useState(tracks.slice(0, 3));

  const [dragStart, setDragStart] = useState({
    axis: "null",
    animation: { x: 0, y: 0 },
  });

  console.log(cards);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-SWIPE_MIN, 0, SWIPE_MIN], [1, 0.5, 1]);
  const shadowBlur = useTransform(x, [-SWIPE_MIN, 0, SWIPE_MIN], [0, 25, 0]);
  const shadowOpacity = useTransform(
    x,
    [-SWIPE_MIN, 0, SWIPE_MIN],
    [0, 0.1, 0]
  );

  //   const opacity =

  const boxShadow = useMotionTemplate`0 ${shadowBlur}px 25px -5px rgba(0, 0, 0, ${shadowOpacity})`;
  const onDirectionLock = (axis) => setDragStart({ ...dragStart, axis: axis });
  const animateCardSwipe = (animation) => {
    setDragStart({ ...dragStart, animation });
    setTimeout(() => {
      setDragStart({ axis: null, animation: { x: 0, y: 0 } });
      x.set(0);
      setCards([tracks[cardAt], ...cards.slice(0, cards.length - 1)]);
      setCardAt(cardAt + 1);
    }, 300);
  };

  const onDragEnd = (info) => {
    if (info.offset.x >= SWIPE_MIN) animateCardSwipe({ x: 475, y: 0 });
    else if (info.offset.x <= -SWIPE_MIN) animateCardSwipe({ x: -475, y: 0 });
  };

  const color = useTransform(
    x,
    [-100, 0, 100],
    ["#8f83d8", "#393359", "#ffc661"]
  );
  const opacity = useTransform(x, [-250, 0, 250], [1, 0, 1]);
  const tickPath = useTransform(x, [10, 100], [0, 1]);
  const crossPathA = useTransform(x, [-10, -55], [0, 1]);
  const crossPathB = useTransform(x, [-50, -100], [0, 1]);

  const renderCards = () => {
    return cards.map((card, index) => {
      if (index === cards.length - 1) {
        return (
          <>
            <TrackCard
              drag="x"
              card={card}
              key={index}
              style={{ x, zIndex: index, touchAction: "none" }}
              onDirectionLock={(axis) => onDirectionLock(axis)}
              onDragEnd={(e, info) => onDragEnd(info)}
              animate={dragStart.animation}
            />
          </>
        );
      } else
        return (
          <TrackCard
            card={card}
            key={index}
            style={{
              scale,
              boxShadow,
              zIndex: index,
            }}
          />
        );
    });
  };

  return (
    <div className="infinite-cards relative z-20 m-auto flex justify-center ">
      {renderCards()}
      <div className="progress-icon fixed bottom-10 z-0 justify-center p-4 text-center">
        <svg className="m-auto h-20" viewBox="0 0 50 50">
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
            style={{ translateX: 5, translateY: 5, opacity: opacity }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M14,26 L 22,33 L 35,16"
            strokeDasharray="0 1"
            style={{ pathLength: tickPath, opacity: opacity }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M17,17 L33,33"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathA, opacity: opacity }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M33,17 L17,33"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathB, opacity: opacity }}
          />
        </svg>
        <h1 className="text-lg font-semibold text-white">{last(cards).name}</h1>
        <h3 className="font-semibold text-[#e3e1e4]">
          {pluck("name", last(cards).artists).join(", ")}
        </h3>
      </div>
    </div>
  );
};

export default InfiniteCards;
