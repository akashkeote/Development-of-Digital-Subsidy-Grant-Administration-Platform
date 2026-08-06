import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    filter: 'blur(2px)',
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  duration: 0.4,
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full flex flex-col flex-1 transform-gpu perspective-1000"
    >
      {children}
    </motion.div>
  );
};
