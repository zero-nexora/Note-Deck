"use client";

import { motion } from "framer-motion";
import { MousePointer2, Move, Type, LucideIcon } from "lucide-react";

interface RealtimeFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface Activity {
  user: string;
  action: string;
  time: string;
}

interface Cursor {
  name: string;
  color: string;
  animation: {
    x: number[];
    y: number[];
  };
  duration: number;
  position: string;
}

const REALTIME_FEATURES: RealtimeFeature[] = [
  {
    icon: MousePointer2,
    title: "Live Cursors",
    desc: "See where your teammates are looking and working",
  },
  {
    icon: Move,
    title: "Instant Card Sync",
    desc: "Drag-and-drop updates appear for everyone immediately",
  },
  {
    icon: Type,
    title: "Typing Indicators",
    desc: "Know when someone is adding comments or editing",
  },
];

const ACTIVITIES: Activity[] = [
  {
    user: "Sarah",
    action: "moved card to In Progress",
    time: "Just now",
  },
  {
    user: "Alex",
    action: "added a comment",
    time: "2m ago",
  },
];

const CURSORS: Cursor[] = [
  {
    name: "Alex",
    color: "blue-500",
    animation: { x: [0, 20, 10], y: [0, -10, 5] },
    duration: 3,
    position: "absolute -top-5 right-16",
  },
  {
    name: "Maya",
    color: "green-500",
    animation: { x: [20, 0, 15], y: [10, 0, -5] },
    duration: 4,
    position: "absolute -bottom-5 left-8",
  },
];

const TYPING_INDICATOR_ANIMATION = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 1.5, repeat: Infinity },
};

const SLIDE_IN_LEFT = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

const SLIDE_IN_RIGHT = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.5 },
};

export const RealtimeShowcase = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content section */}
          <RealtimeContent />

          {/* Demo card */}
          <RealtimeDemo />
        </div>
      </div>
    </section>
  );
};

const RealtimeContent = () => {
  return (
    <motion.div
      initial={SLIDE_IN_LEFT.initial}
      whileInView={SLIDE_IN_LEFT.whileInView}
      viewport={SLIDE_IN_LEFT.viewport}
    >
      <span className="text-sm font-medium text-primary uppercase tracking-wider">
        Real-time
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
        See every edit. Work together like you&apos;re{" "}
        <span className="gradient-text">in the same room</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-8">
        Watch your team collaborate in real-time. See who&apos;s viewing cards,
        track cursor movements, and get instant updates the moment changes
        happen.
      </p>

      <div className="space-y-4">
        {REALTIME_FEATURES.map((feature, index) => (
          <RealtimeFeatureItem
            key={feature.title}
            feature={feature}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface RealtimeFeatureItemProps {
  feature: RealtimeFeature;
  index: number;
}

const RealtimeFeatureItem = ({ feature, index }: RealtimeFeatureItemProps) => {
  const FeatureIcon = feature.icon;
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay }}
      className="flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <FeatureIcon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{feature.title}</h4>
        <p className="text-muted-foreground text-sm">{feature.desc}</p>
      </div>
    </motion.div>
  );
};

const RealtimeDemo = () => {
  return (
    <motion.div
      initial={SLIDE_IN_RIGHT.initial}
      whileInView={SLIDE_IN_RIGHT.whileInView}
      viewport={SLIDE_IN_RIGHT.viewport}
      className="relative"
    >
      <div className="glass-panel p-6 glow-effect">
        {/* Card preview */}
        <div className="bg-card border border-border rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Design homepage layout</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Create responsive hero section with animated elements...
          </p>

          {/* Typing indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <motion.div
              animate={TYPING_INDICATOR_ANIMATION.animate}
              transition={TYPING_INDICATOR_ANIMATION.transition}
              className="flex gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animation-delay-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animation-delay-400" />
            </motion.div>
            <span>Alex is typing...</span>
          </div>

          {/* Live cursors */}
          {CURSORS.map((cursor) => (
            <LiveCursor key={cursor.name} cursor={cursor} />
          ))}
        </div>

        {/* Activity feed */}
        <div className="mt-4 space-y-2">
          {ACTIVITIES.map((activity, index) => (
            <ActivityItem key={index} activity={activity} index={index} />
          ))}
        </div>
      </div>

      {/* Online status badge */}
      <motion.div
        initial={FADE_IN_UP.initial}
        animate={FADE_IN_UP.animate}
        transition={FADE_IN_UP.transition}
        className="absolute -bottom-4 -left-4 glass-panel p-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium">3 teammates online</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface LiveCursorProps {
  cursor: Cursor;
}

const LiveCursor = ({ cursor }: LiveCursorProps) => {
  return (
    <motion.div
      animate={{ x: cursor.animation.x, y: cursor.animation.y }}
      transition={{ duration: cursor.duration, repeat: Infinity }}
      className={cursor.position}
    >
      <div className="flex items-center gap-1">
        <div
          className={`w-3 h-3 border-l-2 border-t-2 border-${cursor.color} -rotate-45`}
        />
        <span
          className={`text-[10px] bg-${cursor.color} text-white px-1.5 py-0.5 rounded font-medium`}
        >
          {cursor.name}
        </span>
      </div>
    </motion.div>
  );
};

interface ActivityItemProps {
  activity: Activity;
  index: number;
}

const ActivityItem = ({ activity, index }: ActivityItemProps) => {
  const animationDelay = index * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      className="flex items-center gap-3 text-xs text-muted-foreground"
    >
      <div className="w-6 h-6 rounded-full bg-primary/20" />
      <span>
        <strong className="text-foreground">{activity.user}</strong>{" "}
        {activity.action}
      </span>
      <span className="ml-auto">{activity.time}</span>
    </motion.div>
  );
};
