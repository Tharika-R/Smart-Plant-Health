import React from 'react';
import { motion } from 'framer-motion';
import './FloatingLeaves.css';

export const FloatingLeaves = () => {
  return (
    <div className="floating-leaves-container" aria-hidden="true">
      <motion.div
        className="floating-leaf leaf-1"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🍃
      </motion.div>

      <motion.div
        className="floating-leaf leaf-2"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        🌿
      </motion.div>

      <motion.div
        className="floating-leaf leaf-3"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        🌱
      </motion.div>
    </div>
  );
};
