"use client";
import { motion } from "framer-motion";

export const LightBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[800px]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(270 70% 60% / 0.15) 60deg, transparent 120deg)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-1/4 top-0 w-[300px] h-[600px]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(280 60% 55% / 0.1) 40deg, transparent 80deg)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute right-1/4 top-0 w-[300px] h-[600px]"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(260 65% 60% / 0.1) 40deg, transparent 80deg)",
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-20 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, hsl(270 70% 60% / 0.3) 50%, transparent 100%)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
