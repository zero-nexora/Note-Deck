"use client";

import { motion } from "framer-motion";
import { MousePointer2, Move, Type } from "lucide-react";

export const RealtimeShowcase = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Real-time
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
              See every edit. Work together like you&apos;re{" "}
              <span className="gradient-text">in the same room</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Watch your team collaborate in real-time. See who&apos;s viewing
              cards, track cursor movements, and get instant updates the moment
              changes happen.
            </p>

            <div className="space-y-4">
              {[
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
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-panel p-6 glow-effect">
              <div className="bg-card border border-border rounded-xl p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">
                    Design homepage layout
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Create responsive hero section with animated elements...
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animation-delay-200" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animation-delay-400" />
                  </motion.div>
                  <span>Alex is typing...</span>
                </div>

                <motion.div
                  animate={{ x: [0, 20, 10], y: [0, -10, 5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-5 right-16"
                >
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-l-2 border-t-2 border-blue-500 -rotate-45" />
                    <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium">
                      Alex
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [20, 0, 15], y: [10, 0, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-5 left-8"
                >
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-l-2 border-t-2 border-green-500 -rotate-45" />
                    <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-medium">
                      Maya
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  {
                    user: "Sarah",
                    action: "moved card to In Progress",
                    time: "Just now",
                  },
                  { user: "Alex", action: "added a comment", time: "2m ago" },
                ].map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-3 text-xs text-muted-foreground"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20" />
                    <span>
                      <strong className="text-foreground">
                        {activity.user}
                      </strong>{" "}
                      {activity.action}
                    </span>
                    <span className="ml-auto">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass-panel p-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium">3 teammates online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
