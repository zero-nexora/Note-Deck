"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const PARTICLE_COUNT = 30;
const MIN_PARTICLE_SIZE = 1;
const MAX_PARTICLE_SIZE = 5;
const MIN_DURATION = 10;
const MAX_DURATION = 20;
const MAX_DELAY = 5;

const PARTICLE_ANIMATION = {
  initial: { y: "100vh", opacity: 0 },
  animate: {
    y: "-10vh",
    opacity: [0, 1, 1, 0],
  },
  transition: {
    repeat: Infinity,
    ease: "linear" as const,
  },
};

const generateParticles = (count: number): Particle[] => {
  if (typeof window === "undefined") return [];

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size:
      Math.random() * (MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE) +
      MIN_PARTICLE_SIZE,
    duration: Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION,
    delay: Math.random() * MAX_DELAY,
  }));
};

export const ParticleBackground = () => {
  const [particles] = useState<Particle[]>(() =>
    generateParticles(PARTICLE_COUNT)
  );

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={PARTICLE_ANIMATION.initial}
          animate={PARTICLE_ANIMATION.animate}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: PARTICLE_ANIMATION.transition.repeat,
            ease: PARTICLE_ANIMATION.transition.ease,
          }}
        />
      ))}
    </div>
  );
};
