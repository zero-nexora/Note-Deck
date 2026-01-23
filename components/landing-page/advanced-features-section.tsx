"use client";

import { easeInOut, easeOut, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Zap, Shield, Layers, Sparkles, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Experience sub-millisecond response times with our optimized infrastructure.",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and compliance certifications protect your data.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    description:
      "From startup to enterprise, our platform grows with your team.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Smart suggestions and automations powered by machine learning.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
  },
];

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 40 },
  hover: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const ICON_ANIMATION = {
  scale: [1, 1.2, 1],
  rotate: [0, -10, 10, -5, 0],
  transition: { duration: 0.6, ease: easeInOut },
};

export function AdvancedFeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="landing-showcase relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />

      <div className="landing-showcase-content">
        <motion.div
          ref={headerRef}
          initial={HEADER_ANIMATION.initial}
          animate={isHeaderInView ? HEADER_ANIMATION.animate : {}}
          transition={HEADER_ANIMATION.transition}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Advanced Capabilities
            </span>
          </div>
          <h2 className="landing-showcase-title mb-6">Built for the Future</h2>
          <p className="landing-showcase-subtitle">
            Cutting-edge technology that empowers teams to achieve more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-120px" });

  const FeatureIcon = feature.icon;
  const cardDelay = index * 0.18;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      ref={cardRef}
      initial={CARD_ANIMATION.initial}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{
        transition: {
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      transition={{ duration: 0.7, delay: cardDelay, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <div className="landing-feature-card h-full group">
        <div
          className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-inherit`}
        />

        <div className="relative z-10">
          <motion.div
            animate={isHovered ? ICON_ANIMATION : {}}
            transition={ICON_ANIMATION.transition}
            className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-button group-hover:shadow-glow transition-all duration-500"
          >
            <FeatureIcon className={`w-8 h-8 ${feature.iconColor}`} />
          </motion.div>

          <h3 className="landing-feature-title mb-4">{feature.title}</h3>
          <p className="landing-feature-description text-base">
            {feature.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-inherit" />
      </div>
    </motion.div>
  );
};
