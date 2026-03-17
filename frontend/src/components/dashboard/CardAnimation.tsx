import { motion } from 'framer-motion';
import type React from 'react';

const CardAnimation = ({ children, i }: { children: React.ReactNode; i: number }) => {
  return (
    <motion.div
      layout
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ delay: 0.05 * i, ease: 'easeIn' }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export default CardAnimation;
