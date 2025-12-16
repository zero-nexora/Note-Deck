"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { UserPlus, Layout, Users, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds with your email or social accounts.",
  },
  {
    icon: Layout,
    title: "Build Your Board",
    description: "Create lists, add cards, and organize your workflow.",
  },
  {
    icon: Users,
    title: "Invite Your Team",
    description: "Collaborate in real-time with unlimited team members.",
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "Ship faster and iterate with powerful automation.",
  },
];

export const HowItWorkSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 glow-text">
            Get Started in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform how your team works together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="perspective-1000 order-2 lg:order-1"
          >
            <motion.div
              animate={{
                rotateX: mousePosition.y * -15,
                rotateY: mousePosition.x * 15,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="relative transform-style-3d"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="bg-background-elevated rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="text-sm text-muted-foreground ml-2">
                      Project Dashboard
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["To Do", "In Progress", "Done"].map((col, i) => (
                      <div key={col} className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {col}
                        </div>
                        {[...Array(3 - i)].map((_, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.5 + (i * 3 + j) * 0.1 }}
                            className="bg-card/50 rounded-lg p-2 border border-border/30"
                          >
                            <div className="h-2 w-3/4 bg-muted rounded mb-1" />
                            <div className="h-1.5 w-1/2 bg-muted/50 rounded" />
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30"
              >
                ● Live
              </motion.div>
            </motion.div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-4 group"
                >
                  <div className="shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-border group-hover:bg-primary/20 transition-colors"
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-primary">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold font-display text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
