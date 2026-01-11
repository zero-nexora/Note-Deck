"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { useEffect } from "react";

const SPRING_CONFIG = {
  stiffness: 60,
  damping: 25,
};

const GRADIENT_RADIUS = 500;

export const InteractiveCursorBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  const background = useMotionTemplate`radial-gradient(${GRADIENT_RADIUS}px circle at ${springX}px ${springY}px, hsl(262 83% 58% / 0.08), hsl(262 75% 60% / 0.04) 40%, transparent 70%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background }}
    />
  );
};
