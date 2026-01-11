"use client";

import { easeInOut, motion } from "framer-motion";

interface LightBeam {
  className: string;
  background: string;
  opacity: number[];
  duration: number;
  delay?: number;
}

const LIGHT_BEAMS: LightBeam[] = [
  {
    className: "absolute left-1/2 -translate-x-1/2 top-0 w-[500px] h-[700px]",
    background:
      "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(262 83% 58% / 0.15) 50deg, transparent 100deg)",
    opacity: [0.5, 0.8, 0.5],
    duration: 5,
  },
  {
    className: "absolute left-1/4 top-0 w-[250px] h-[500px]",
    background:
      "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(262 80% 55% / 0.1) 40deg, transparent 80deg)",
    opacity: [0.4, 0.6, 0.4],
    duration: 6,
    delay: 1.5,
  },
  {
    className: "absolute right-1/4 top-0 w-[250px] h-[500px]",
    background:
      "conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(262 78% 60% / 0.1) 40deg, transparent 80deg)",
    opacity: [0.35, 0.55, 0.35],
    duration: 7,
    delay: 3,
  },
];

const HORIZONTAL_BEAM = {
  className: "absolute top-20 left-0 right-0 h-px",
  background:
    "linear-gradient(90deg, transparent 0%, hsl(262 83% 58% / 0.3) 50%, transparent 100%)",
  opacity: [0.3, 0.5, 0.3],
  duration: 4,
};

const ANIMATION_CONFIG = {
  repeat: Infinity,
  ease: easeInOut,
};

export const LightBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {LIGHT_BEAMS.map((beam, index) => (
        <motion.div
          key={index}
          className={beam.className}
          style={{ background: beam.background }}
          animate={{ opacity: beam.opacity }}
          transition={{
            duration: beam.duration,
            repeat: ANIMATION_CONFIG.repeat,
            ease: ANIMATION_CONFIG.ease,
            delay: beam.delay,
          }}
        />
      ))}

      <motion.div
        className={HORIZONTAL_BEAM.className}
        style={{ background: HORIZONTAL_BEAM.background }}
        animate={{ opacity: HORIZONTAL_BEAM.opacity }}
        transition={{
          duration: HORIZONTAL_BEAM.duration,
          repeat: ANIMATION_CONFIG.repeat,
          ease: ANIMATION_CONFIG.ease,
        }}
      />
    </div>
  );
};
