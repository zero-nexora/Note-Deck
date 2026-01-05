"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const FADE_IN_SCALE = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
};

const BUTTON_HOVER = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

const CTA_FEATURES = [
  "Free forever plan",
  "No credit card",
  "Setup in 2 minutes",
];

export const CTASection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          className="glass-panel p-12 md:p-16 text-center glow-effect"
        >
          <motion.div
            initial={FADE_IN_SCALE.initial}
            whileInView={FADE_IN_SCALE.whileInView}
            viewport={FADE_IN_SCALE.viewport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Free forever plan available
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start collaborating{" "}
            <span className="gradient-text">in seconds</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of teams already using Flowboard to ship faster. No
            credit card required to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <motion.button
                whileHover={BUTTON_HOVER.whileHover}
                whileTap={BUTTON_HOVER.whileTap}
                className="rounded-full bg-linear-to-r from-primary to-primary-glow text-primary-foreground px-7 py-3 font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95"
              >
                Create Free Workspace
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={BUTTON_HOVER.whileHover}
              whileTap={BUTTON_HOVER.whileTap}
              className="rounded-full border border-primary/40 bg-transparent text-foreground px-7 py-3 font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95"
            >
              Schedule a Demo
            </motion.button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            {CTA_FEATURES.map((feature, index) => (
              <span key={feature}>
                ✓ {feature}
                {index < CTA_FEATURES.length - 1 && " \u00A0\u00A0 "}
              </span>
            ))}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
