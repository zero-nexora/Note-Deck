"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Bell, UserPlus, Tag, Move } from "lucide-react";

const automationExamples = [
  {
    trigger: { icon: Move, text: "Card moved to Done" },
    action: { icon: Bell, text: "Notify team in Slack" },
  },
  {
    trigger: { icon: Tag, text: "Label 'Urgent' added" },
    action: { icon: UserPlus, text: "Assign to team lead" },
  },
];

export const AutomationSection = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="glass-panel p-6 glow-effect">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">Automation Builder</span>
              </div>

              <div className="space-y-6">
                {automationExamples.map((automation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1 bg-secondary/50 rounded-xl p-4">
                      <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                        When
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <automation.trigger.icon className="w-5 h-5 text-amber-500" />
                        </div>
                        <span className="text-sm font-medium">
                          {automation.trigger.text}
                        </span>
                      </div>
                    </div>

                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>

                    <div className="flex-1 bg-secondary/50 rounded-xl p-4">
                      <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                        Then
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <automation.action.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {automation.action.text}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors text-sm">
                + Create new automation
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Automation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
              Let automation do the{" "}
              <span className="gradient-text">repetitive work</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create custom rules to automate your workflow. Move cards, assign
              members, send notifications, and more—without lifting a finger.
            </p>

            <ul className="space-y-3">
              {[
                "50+ pre-built automation templates",
                "Custom triggers based on any card action",
                "Integrate with Slack, Email, and Webhooks",
                "Scheduled automations for recurring tasks",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
