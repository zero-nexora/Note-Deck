"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const FADE_IN_SCALE = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: 0.1 },
};

const BUTTON_HOVER = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const CTA_FEATURES = [
  "Free forever plan",
  "No credit card",
  "Setup in 2 minutes",
];

export const CTASection = () => {
  return (
    <section className="section-padding px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-primary/8 to-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          transition={FADE_IN_UP.transition}
          className="glass-card p-12 md:p-16 text-center shadow-glow"
        >
          <motion.div
            initial={FADE_IN_SCALE.initial}
            whileInView={FADE_IN_SCALE.whileInView}
            viewport={FADE_IN_SCALE.viewport}
            transition={FADE_IN_SCALE.transition}
            className="badge badge-primary inline-flex items-center gap-2 mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Get Started Today
              </span>
            </div>
          </motion.div>

          <h2 className="text-display mb-6">
            Start collaborating{" "}
            <span className="gradient-text">in seconds</span>
          </h2>

          <p className="text-subheading mb-8 max-w-xl mx-auto">
            Join thousands of teams already using Flowboard to ship faster. No
            credit card required to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <motion.button
                whileHover={BUTTON_HOVER.whileHover}
                whileTap={BUTTON_HOVER.whileTap}
                className="btn-primary flex items-center gap-2"
              >
                Create Free Workspace
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={BUTTON_HOVER.whileHover}
              whileTap={BUTTON_HOVER.whileTap}
              className="btn-outline flex items-center gap-2"
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
