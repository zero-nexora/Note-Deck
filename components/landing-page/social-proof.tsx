"use client";

import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const COMPANIES = ["Spotify", "Slack", "Dropbox", "Notion", "Figma", "Linear"];

const STATS: Stat[] = [
  { value: "10,000,000+", label: "Tasks completed" },
  { value: "50,000+", label: "Teams" },
  { value: "99.9%", label: "Uptime" },
];

const FADE_IN = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
};

const FADE_IN_UP = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const SocialProof = () => {
  return (
    <section className="py-16 px-4 border-y border-border/50">
      <div className="max-w-7xl mx-auto">
        {/* Header text */}
        <motion.p
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          className="text-center text-muted-foreground mb-10"
        >
          Trusted by teams at companies worldwide
        </motion.p>

        {/* Company logos */}
        <motion.div
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {COMPANIES.map((company, index) => (
            <CompanyLogo key={company} company={company} index={index} />
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center gap-8 md:gap-16"
        >
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface CompanyLogoProps {
  company: string;
  index: number;
}

const CompanyLogo = ({ company, index }: CompanyLogoProps) => {
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={FADE_IN_UP.initial}
      whileInView={FADE_IN_UP.whileInView}
      viewport={FADE_IN_UP.viewport}
      transition={{ delay: animationDelay }}
      className="group relative"
    >
      <span className="text-xl md:text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default">
        {company}
      </span>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="glass-panel px-3 py-1.5 text-xs whitespace-nowrap">
          10,000+ users at {company}
        </div>
      </div>
    </motion.div>
  );
};

interface StatItemProps {
  stat: Stat;
}

const StatItem = ({ stat }: StatItemProps) => {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-4xl font-bold gradient-text">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
    </div>
  );
};
