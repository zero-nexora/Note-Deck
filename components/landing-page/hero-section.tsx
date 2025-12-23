"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layout, Users, Zap, LucideIcon } from "lucide-react";
import Link from "next/link";

interface FloatingCard {
  title: string;
  label: string;
  color: string;
}

interface HeroFeature {
  icon: LucideIcon;
  text: string;
}

const FLOATING_CARDS: FloatingCard[] = [
  { title: "Design Review", label: "In Progress", color: "bg-primary" },
  { title: "User Research", label: "Done", color: "bg-green-500" },
  { title: "API Integration", label: "To Do", color: "bg-amber-500" },
];

const HERO_FEATURES: HeroFeature[] = [
  { icon: Zap, text: "Real-time sync" },
  { icon: Layout, text: "Unlimited boards" },
  { icon: Users, text: "Team workspaces" },
];

const BOARD_LISTS = ["To Do", "In Progress", "Done"];
const TEAM_AVATARS = [1, 2, 3];

const HERO_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const BADGE_ANIMATION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.2 },
};

const DEMO_ANIMATION = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, delay: 0.3 },
};

const BUTTON_HOVER = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

const CURSOR_ANIMATION = {
  animate: { x: [0, 10, 0], y: [0, -5, 0] },
  transition: { duration: 2, repeat: Infinity },
};

const SYNC_BADGE_ANIMATION = {
  animate: { y: [-5, 5, -5] },
  transition: { duration: 3, repeat: Infinity },
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4">
      {/* Background effects */}
      <div className="light-ray animate-pulse-glow" />
      <div className="absolute inset-0 bg-grid-pattern bg-size-[60px_60px] opacity-[0.03]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <HeroContent />

          {/* Demo board */}
          <DemoBoard />
        </div>
      </div>
    </section>
  );
};

const HeroContent = () => {
  return (
    <motion.div
      initial={HERO_ANIMATION.initial}
      animate={HERO_ANIMATION.animate}
      transition={HERO_ANIMATION.transition}
      className="text-center lg:text-left"
    >
      {/* Announcement badge */}
      <motion.div
        initial={BADGE_ANIMATION.initial}
        animate={BADGE_ANIMATION.animate}
        transition={BADGE_ANIMATION.transition}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
      >
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          New: Real-time cursors now live
        </span>
      </motion.div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
        Collaborate in Real-Time.{" "}
        <span className="gradient-text">Get Work Done Faster.</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
        Organize projects with boards, lists, and cards. See every edit as it
        happens. Work together like you&apos;re in the same room—anywhere in the
        world.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
        <Link href={"/sign-up"}>
          <motion.button
            whileHover={BUTTON_HOVER.whileHover}
            whileTap={BUTTON_HOVER.whileTap}
            className="rounded-full bg-linear-to-r from-primary to-primary-glow text-primary-foreground px-7 py-3 font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>

        <motion.button
          whileHover={BUTTON_HOVER.whileHover}
          whileTap={BUTTON_HOVER.whileTap}
          className="rounded-full border border-primary/40 bg-transparent text-foreground px-7 py-3 font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95"
        >
          Try Demo
        </motion.button>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
        {HERO_FEATURES.map((feature, index) => (
          <HeroFeatureBadge
            key={feature.text}
            feature={feature}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface HeroFeatureBadgeProps {
  feature: HeroFeature;
  index: number;
}

const HeroFeatureBadge = ({ feature, index }: HeroFeatureBadgeProps) => {
  const FeatureIcon = feature.icon;
  const animationDelay = 0.5 + index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="flex items-center gap-2 text-muted-foreground"
    >
      <FeatureIcon className="w-4 h-4 text-primary" />
      <span className="text-sm">{feature.text}</span>
    </motion.div>
  );
};

const DemoBoard = () => {
  return (
    <motion.div
      initial={DEMO_ANIMATION.initial}
      animate={DEMO_ANIMATION.animate}
      transition={DEMO_ANIMATION.transition}
      className="relative"
    >
      <div className="glass-panel p-6 glow-effect">
        {/* Board header */}
        <BoardHeader />

        {/* Board lists */}
        <div className="grid grid-cols-3 gap-4">
          {BOARD_LISTS.map((listName, listIndex) => (
            <BoardList
              key={listName}
              listName={listName}
              listIndex={listIndex}
            />
          ))}
        </div>

        {/* Floating cursor indicator */}
        <motion.div
          animate={CURSOR_ANIMATION.animate}
          transition={CURSOR_ANIMATION.transition}
          className="absolute -bottom-4 -right-4"
        >
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-l-2 border-t-2 border-primary -rotate-45" />
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">
              Sarah
            </span>
          </div>
        </motion.div>
      </div>

      {/* Live sync badge */}
      <motion.div
        animate={SYNC_BADGE_ANIMATION.animate}
        transition={SYNC_BADGE_ANIMATION.transition}
        className="absolute -top-6 -left-6 glass-panel p-3 flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm font-medium">Live sync</span>
      </motion.div>
    </motion.div>
  );
};

const BoardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="font-semibold">Project Alpha</span>
      </div>
      <div className="flex -space-x-2">
        {TEAM_AVATARS.map((avatar) => (
          <div
            key={avatar}
            className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent border-2 border-background"
          />
        ))}
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border-2 border-background">
          +5
        </div>
      </div>
    </div>
  );
};

interface BoardListProps {
  listName: string;
  listIndex: number;
}

const BoardList = ({ listName, listIndex }: BoardListProps) => {
  const cardsForList = FLOATING_CARDS.filter((_, i) => i % 3 === listIndex)
    .concat([FLOATING_CARDS[(listIndex + 1) % 3]])
    .slice(0, 2);

  return (
    <div className="bg-secondary/50 rounded-xl p-3">
      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
        {listName}
      </h4>
      <div className="space-y-2">
        {cardsForList.map((card, cardIndex) => (
          <BoardCard
            key={`${listName}-${cardIndex}`}
            card={card}
            cardIndex={cardIndex}
            listIndex={listIndex}
          />
        ))}
      </div>
    </div>
  );
};

interface BoardCardProps {
  card: FloatingCard;
  cardIndex: number;
  listIndex: number;
}

const BoardCard = ({ card, cardIndex, listIndex }: BoardCardProps) => {
  const animationDelay = 0.6 + cardIndex * 0.1 + listIndex * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="bg-card p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <div className={`w-12 h-1.5 rounded-full ${card.color} mb-2`} />
      <p className="text-sm font-medium">{card.title}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full bg-primary/30" />
          <div className="w-5 h-5 rounded-full bg-accent/30" />
        </div>
        <span className="text-xs text-muted-foreground">2d</span>
      </div>
    </motion.div>
  );
};
