"use client";

import { cubicBezier, easeInOut, motion } from "framer-motion";
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
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: cubicBezier(0.4, 0, 0.2, 1) },
};

const BADGE_ANIMATION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.1, duration: 0.4 },
};

const DEMO_ANIMATION = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay: 0.2 },
};

const BUTTON_HOVER = {
  whileHover: { scale: 1.05, y: -2 },
  whileTap: { scale: 0.98 },
};

const CURSOR_ANIMATION = {
  animate: { x: [0, 8, 0], y: [0, -4, 0] },
  transition: { duration: 2.5, repeat: Infinity, ease: easeInOut },
};

const SYNC_BADGE_ANIMATION = {
  animate: { y: [-4, 4, -4] },
  transition: { duration: 3, repeat: Infinity, ease: easeInOut },
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4">
      <div className="absolute inset-0 dot-pattern opacity-60" />
      <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroContent />
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
      <motion.div
        initial={BADGE_ANIMATION.initial}
        animate={BADGE_ANIMATION.animate}
        transition={BADGE_ANIMATION.transition}
        className="badge badge-primary inline-flex items-center gap-2 mb-6 shadow-button hover:shadow-glow transition-shadow duration-300"
      >
        <Zap className="w-4 h-4 animate-pulse" />
        <span className="font-medium">New: Real-time cursors now live</span>
      </motion.div>

      <h1 className="text-display mb-6">
        Collaborate in Real-Time.{" "}
        <span className="gradient-text animate-shimmer">
          Get Work Done Faster.
        </span>
      </h1>

      <p className="text-subheading mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
        Organize projects with boards, lists, and cards. See every edit as it
        happens. Work together like you&apos;re in the same room—anywhere in the
        world.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
        <Link href="/sign-up">
          <motion.button
            whileHover={BUTTON_HOVER.whileHover}
            whileTap={BUTTON_HOVER.whileTap}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        <motion.button
          whileHover={BUTTON_HOVER.whileHover}
          whileTap={BUTTON_HOVER.whileTap}
          className="btn-outline flex items-center gap-2 px-6 py-3 text-base hover:border-primary/50"
        >
          Try Demo
        </motion.button>
      </div>

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
  const animationDelay = 0.4 + index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="flex items-center gap-2 text-muted-foreground text-sm group hover:text-foreground transition-colors duration-300"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
        <FeatureIcon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-medium">{feature.text}</span>
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
      <motion.div
        animate={SYNC_BADGE_ANIMATION.animate}
        transition={SYNC_BADGE_ANIMATION.transition}
        className="absolute top-1 -left-10 glass-card p-3 flex items-center gap-2 shadow-glow border-green-500/20 z-10"
      >
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shadow-inner">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" />
        </div>
        <span className="text-sm font-semibold">Live sync</span>
      </motion.div>
      <div className="glass-card p-6 shadow-glow border-border/50 backdrop-blur-md hover:shadow-glow transition-shadow duration-500">
        <BoardHeader />

        <div className="grid grid-cols-3 gap-3">
          {BOARD_LISTS.map((listName, listIndex) => (
            <BoardList
              key={listName}
              listName={listName}
              listIndex={listIndex}
            />
          ))}
        </div>

        <motion.div
          animate={CURSOR_ANIMATION.animate}
          transition={CURSOR_ANIMATION.transition}
          className="absolute -bottom-3 -right-3"
        >
          <div className="flex items-center gap-1.5 drop-shadow-lg">
            <div className="w-4 h-4 border-l-2 border-t-2 border-primary -rotate-45 drop-shadow-glow" />
            <span className="badge badge-primary text-xs px-2 py-0.5 shadow-button font-medium">
              Sarah
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const BoardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/30">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-primary shadow-glow animate-pulse" />
        <span className="font-semibold text-base">Project Alpha</span>
      </div>
      <div className="flex -space-x-2">
        {TEAM_AVATARS.map((avatar) => (
          <div
            key={avatar}
            className="avatar avatar-sm ring-2 ring-card hover:scale-110 transition-transform duration-200"
            style={{
              background:
                "linear-gradient(135deg, hsl(262 83% 58%), hsl(262 90% 70%))",
            }}
          />
        ))}
        <div className="avatar avatar-sm bg-secondary text-xs font-medium ring-2 ring-card hover:scale-110 transition-transform duration-200">
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
    <div className="board-column backdrop-blur-sm hover:bg-muted/40 transition-colors duration-300">
      <div className="board-column-header">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {listName}
        </h4>
      </div>
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
  const animationDelay = 0.5 + cardIndex * 0.1 + listIndex * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="task-card group"
    >
      <div
        className={`w-10 h-1 rounded-full ${card.color} mb-2 shadow-lg group-hover:w-12 transition-all duration-300`}
      />
      <p className="text-xs font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
        {card.title}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full bg-primary/20 border border-card group-hover:scale-110 transition-transform duration-200" />
          <div className="w-5 h-5 rounded-full bg-accent/20 border border-card group-hover:scale-110 transition-transform duration-200" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">2d</span>
      </div>
    </motion.div>
  );
};
