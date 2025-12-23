"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Layout,
  Users,
  MessageSquare,
  Tag,
  Workflow,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Real-time Collaboration",
    description:
      "See live cursors, instant card updates, and typing indicators. Work together seamlessly no matter where you are.",
  },
  {
    icon: Layout,
    title: "Boards, Lists & Cards",
    description:
      "Organize everything with flexible boards. Create lists for stages and cards for tasks. Drag and drop to prioritize.",
  },
  {
    icon: Users,
    title: "Workspaces & Permissions",
    description:
      "Create separate workspaces for teams. Set granular permissions to control who can view, edit, or admin.",
  },
  {
    icon: MessageSquare,
    title: "Comments & Reactions",
    description:
      "Discuss tasks directly on cards. Add reactions, @mentions, and keep all context in one place.",
  },
  {
    icon: Tag,
    title: "Labels & Checklists",
    description:
      "Categorize with colored labels. Break down tasks with checklists. Attach files and set due dates.",
  },
  {
    icon: Workflow,
    title: "Automation Rules",
    description:
      "Set up triggers and actions. Move cards, assign members, send notifications—all automatically.",
  },
];

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From simple task management to complex workflows, Flowboard adapts
            to how your team works.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const FeatureIcon = feature.icon;
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay }}
      className="glass-panel p-6 card-hover group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <FeatureIcon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};

