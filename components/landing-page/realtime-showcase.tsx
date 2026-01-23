"use client";

import { motion } from "framer-motion";
import { MousePointer2, Move, Type, LucideIcon, Activity } from "lucide-react";

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
  borderColor: string;
  bgColor: string;
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
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500",
    animation: { x: [0, 15, 8], y: [0, -8, 3] },
    duration: 3.5,
    position: "absolute -top-4 right-12",
  },
  {
    name: "Maya",
    color: "green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500",
    animation: { x: [15, 0, 10], y: [8, 0, -3] },
    duration: 4.5,
    position: "absolute -bottom-4 left-6",
  },
];

const TYPING_INDICATOR_ANIMATION = {
  animate: { opacity: [0.3, 1, 0.3] },
  transition: { duration: 1.5, repeat: Infinity },
};

const SLIDE_IN_LEFT = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const SLIDE_IN_RIGHT = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const FADE_IN_UP = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.4 },
};

export const RealtimeShowcase = () => {
  return (
    <section className="section-padding px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <RealtimeContent />
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
      transition={SLIDE_IN_LEFT.transition}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          Realtime Collaboration
        </span>
      </div>
      <h2 className="text-heading mt-4 mb-6">
        See every edit. Work together like you&apos;re{" "}
        <span className="gradient-text">in the same room</span>
      </h2>
      <p className="text-subheading mb-8">
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
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay, duration: 0.4 }}
      className="flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FeatureIcon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold mb-1 text-sm">{feature.title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.desc}
        </p>
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
      transition={SLIDE_IN_RIGHT.transition}
      className="relative"
    >
      <div className="glass-card p-6 shadow-glow">
        <div className="task-card relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Design homepage layout</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Create responsive hero section with animated elements...
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <motion.div
              animate={TYPING_INDICATOR_ANIMATION.animate}
              transition={TYPING_INDICATOR_ANIMATION.transition}
              className="flex gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-primary" />
              <span className="w-1 h-1 rounded-full bg-primary delay-100" />
              <span className="w-1 h-1 rounded-full bg-primary delay-200" />
            </motion.div>
            <span>Alex is typing...</span>
          </div>

          {CURSORS.map((cursor) => (
            <LiveCursor key={cursor.name} cursor={cursor} />
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {ACTIVITIES.map((activity, index) => (
            <ActivityItem key={index} activity={activity} index={index} />
          ))}
        </div>
      </div>

      <motion.div
        initial={FADE_IN_UP.initial}
        animate={FADE_IN_UP.animate}
        transition={FADE_IN_UP.transition}
        className="absolute -bottom-3 -left-3 glass-card p-3 shadow-card"
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
      transition={{
        duration: cursor.duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cursor.position}
    >
      <div className="flex items-center gap-1">
        <div
          className={`w-3 h-3 border-l-2 border-t-2 ${cursor.borderColor} -rotate-45`}
        />
        <span
          className={`text-[10px] ${cursor.bgColor} text-white px-1.5 py-0.5 rounded font-medium`}
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
  const animationDelay = index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay, duration: 0.3 }}
      className="flex items-center gap-3 text-xs text-muted-foreground"
    >
      <div className="avatar avatar-sm bg-primary/20" />
      <span>
        <strong className="text-foreground">{activity.user}</strong>{" "}
        {activity.action}
      </span>
      <span className="ml-auto">{activity.time}</span>
    </motion.div>
  );
};
