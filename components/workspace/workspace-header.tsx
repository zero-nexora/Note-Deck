"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WorkspaceHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">WorkFlow Pro</span>
      </div>

      <h1 className="text-4xl font-display font-bold mb-3 glow-text">
        Choose a workspace
      </h1>

      <p className="text-muted-foreground">
        Select a workspace to continue, or create a new one.
      </p>
    </motion.div>
  );
}
