"use client";

import { motion } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const COMPANIES = ["Spotify", "Slack", "Dropbox", "Notion", "Figma", "Linear"];

const STATS: Stat[] = [
  { value: "10M+", label: "Tasks completed" },
  { value: "50K+", label: "Teams" },
  { value: "99.9%", label: "Uptime" },
];

const FADE_IN = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const FADE_IN_UP = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const SocialProof = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="container-custom relative z-10">
        <motion.p
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          transition={FADE_IN.transition}
          className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-wider"
        >
          Trusted by teams at companies worldwide
        </motion.p>

        <motion.div
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          transition={{ ...FADE_IN.transition, delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {COMPANIES.map((company, index) => (
            <CompanyLogo key={company} company={company} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={FADE_IN.initial}
          whileInView={FADE_IN.whileInView}
          viewport={FADE_IN.viewport}
          transition={{ ...FADE_IN.transition, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
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
  const animationDelay = index * 0.08;

  return (
    <motion.div
      initial={FADE_IN_UP.initial}
      whileInView={FADE_IN_UP.whileInView}
      viewport={FADE_IN_UP.viewport}
      transition={{ delay: animationDelay, duration: 0.4 }}
      className="group relative"
    >
      <span className="text-xl md:text-2xl font-semibold text-muted-foreground/40 hover:text-foreground transition-all duration-300 cursor-default relative">
        {company}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-primary bg-clip-text text-transparent">
          {company}
        </span>
      </span>

      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
        <div className="glass-card px-3 py-1.5 text-xs whitespace-nowrap shadow-glow border border-primary/20">
          <span className="text-primary font-medium">10K+</span> users at{" "}
          {company}
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
    <div className="text-center group">
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-1 transition-transform duration-300 group-hover:scale-110">
        {stat.value}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
        {stat.label}
      </div>
    </div>
  );
};
