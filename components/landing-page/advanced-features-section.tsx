"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Layers, Sparkles, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Experience sub-millisecond response times with our optimized infrastructure.",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and compliance certifications protect your data.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "From startup to enterprise, our platform grows with your team.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Smart suggestions and automations powered by machine learning.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 50 },
  hover: {
    rotateX: -5,
    rotateY: 5,
    scale: 1.02,
  },
  spring: { type: "spring" as const, stiffness: 300, damping: 20 },
};

const ICON_SHAKE_ANIMATION = {
  rotate: [0, -10, 10, -10, 0],
  transition: { duration: 0.5 },
};

export const AdvancedFeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={HEADER_ANIMATION.initial}
          animate={isHeaderInView ? HEADER_ANIMATION.animate : {}}
          transition={HEADER_ANIMATION.transition}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Advanced Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 glow-text">
            Built for the Future
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology that empowers teams to achieve more.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const FeatureIcon = feature.icon;
  const cardDelay = index * 0.15;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      ref={cardRef}
      initial={CARD_ANIMATION.initial}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: cardDelay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
    >
      <motion.div
        animate={
          isHovered
            ? CARD_ANIMATION.hover
            : { rotateX: 0, rotateY: 0, scale: 1 }
        }
        transition={CARD_ANIMATION.spring}
        className="transform-style-3d h-full"
      >
        <Card className="glass-card h-full border-border/30 overflow-hidden group">
          <div
            className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <CardHeader className="relative z-10">
            <motion.div
              animate={isHovered ? ICON_SHAKE_ANIMATION : {}}
              transition={ICON_SHAKE_ANIMATION.transition}
              className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 glow-border"
            >
              <FeatureIcon className="w-7 h-7 text-primary" />
            </motion.div>
            <CardTitle className="text-xl font-display text-foreground">
              {feature.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
