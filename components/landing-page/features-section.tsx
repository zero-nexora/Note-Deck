"use client";

import { easeOut, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Zap,
  Layout,
  Users,
  MessageSquare,
  Tag,
  Workflow,
  LucideIcon,
  Layers,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description:
      "See live cursors, instant card updates, and typing indicators. Work together seamlessly no matter where you are.",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: Layout,
    title: "Boards, Lists & Cards",
    description:
      "Organize everything with flexible boards. Create lists for stages and cards for tasks. Drag and drop to prioritize.",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: Users,
    title: "Workspaces & Permissions",
    description:
      "Create separate workspaces for teams. Set granular permissions to control who can view, edit, or admin.",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    icon: MessageSquare,
    title: "Comments & Reactions",
    description:
      "Discuss tasks directly on cards. Add reactions, @mentions, and keep all context in one place.",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: Tag,
    title: "Labels & Checklists",
    description:
      "Categorize with colored labels. Break down tasks with checklists. Attach files and set due dates.",
    gradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    icon: Workflow,
    title: "Automation Rules",
    description:
      "Set up triggers and actions. Move cards, assign members, send notifications—all automatically.",
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
];

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: easeOut },
  },
};

const ICON_ANIMATION = {
  scale: [1, 1.15, 1],
  rotate: [0, -8, 8, -8, 0],
  transition: { duration: 0.5 },
};

export const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="features" className="landing-features relative">
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-r from-primary/10 to-transparent blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-linear-to-l from-primary/8 to-transparent blur-3xl pointer-events-none animate-pulse-glow delay-500" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={headerRef}
          initial={HEADER_ANIMATION.initial}
          animate={isHeaderInView ? HEADER_ANIMATION.animate : {}}
          transition={HEADER_ANIMATION.transition}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Core Features
            </span>
          </div>
          <h2 className="text-display mb-6">
            Everything you need to{" "}
            <span className="landing-title-gradient">ship faster</span>
          </h2>
          <p className="text-subheading max-w-3xl mx-auto">
            From simple task management to complex workflows, Flowboard adapts
            to how your team works.
          </p>
        </motion.div>

        <div className="landing-features-grid">
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
  const cardDelay = index * 0.12;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      ref={cardRef}
      initial={CARD_ANIMATION.initial}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={CARD_ANIMATION.hover}
      transition={{ duration: 0.6, delay: cardDelay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="landing-feature-card group"
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-inherit pointer-events-none`}
      />

      <div className="relative z-10">
        <motion.div
          animate={isHovered ? ICON_ANIMATION : {}}
          transition={ICON_ANIMATION.transition}
          className="landing-feature-icon mb-6"
        >
          <FeatureIcon className="w-7 h-7" />
        </motion.div>

        <h3 className="landing-feature-title">{feature.title}</h3>
        <p className="landing-feature-description">{feature.description}</p>
      </div>
    </motion.div>
  );
};
