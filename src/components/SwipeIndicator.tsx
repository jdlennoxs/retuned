import { motion, useTransform } from "framer-motion";

const SwipeIndicator = ({ x, swipeMin }) => {
  const color = useTransform(
    x,
    [-100, 0, 100],
    ["#8f83d8", "#393359", "#ffda61"]
  );
  const opacity = useTransform(x, [-swipeMin, 0, swipeMin], [1, 0, 1]);
  const tickPath = useTransform(x, [10, swipeMin / 2], [0, 1]);
  const crossPathA = useTransform(x, [-10, -25], [0, 1]);
  const crossPathB = useTransform(x, [-25, -swipeMin / 2], [0, 1]);

  return (
    <svg className="m-auto h-32" viewBox="0 0 50 50">
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
  );
};
export default SwipeIndicator;
