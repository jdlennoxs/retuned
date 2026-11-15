import { motion } from "framer-motion";

export interface MotionWrapperProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  index,
  className,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, delay: 1 + 0.1 * index }}
  >
    {children}
  </motion.div>
);