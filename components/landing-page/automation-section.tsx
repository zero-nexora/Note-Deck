"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Bell,
  UserPlus,
  Tag,
  Move,
  LucideIcon,
} from "lucide-react";

interface AutomationStep {
  icon: LucideIcon;
  text: string;
}

interface Automation {
  trigger: AutomationStep;
  action: AutomationStep;
}

const AUTOMATION_EXAMPLES: Automation[] = [
  {
    trigger: { icon: Move, text: "Card moved to Done" },
    action: { icon: Bell, text: "Notify team in Slack" },
  },
  {
    trigger: { icon: Tag, text: "Label 'Urgent' added" },
    action: { icon: UserPlus, text: "Assign to team lead" },
  },
];

const AUTOMATION_BENEFITS = [
  "50+ pre-built automation templates",
  "Custom triggers based on any card action",
  "Integrate with Slack, Email, and Webhooks",
  "Scheduled automations for recurring tasks",
];

const ARROW_ANIMATION = {
  animate: { x: [0, 5, 0] },
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
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const FADE_IN_RIGHT = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
};

export const AutomationSection = () => {
  return (
    <section className="py-24 px-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-primary/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Automation builder panel */}
          <motion.div
            initial={SLIDE_IN_LEFT.initial}
            whileInView={SLIDE_IN_LEFT.whileInView}
            viewport={SLIDE_IN_LEFT.viewport}
            className="order-2 lg:order-1"
          >
            <div className="glass-panel p-6 glow-effect">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-semibold">Automation Builder</span>
              </div>

              <div className="space-y-6">
                {AUTOMATION_EXAMPLES.map((automation, index) => (
                  <AutomationFlow
                    key={index}
                    automation={automation}
                    index={index}
                  />
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors text-sm">
                + Create new automation
              </button>
            </div>
          </motion.div>

          {/* Content section */}
          <motion.div
            initial={SLIDE_IN_RIGHT.initial}
            whileInView={SLIDE_IN_RIGHT.whileInView}
            viewport={SLIDE_IN_RIGHT.viewport}
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
              {AUTOMATION_BENEFITS.map((benefit, index) => (
                <BenefitItem key={benefit} benefit={benefit} index={index} />
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface AutomationFlowProps {
  automation: Automation;
  index: number;
}

const AutomationFlow = ({ automation, index }: AutomationFlowProps) => {
  const animationDelay = index * 0.2;

  return (
    <motion.div
      initial={FADE_IN_UP.initial}
      whileInView={FADE_IN_UP.whileInView}
      viewport={FADE_IN_UP.viewport}
      transition={{ delay: animationDelay }}
      className="flex items-center gap-4"
    >
      {/* Trigger step */}
      <AutomationStep
        step={automation.trigger}
        label="When"
        iconBgColor="bg-amber-500/20"
        iconColor="text-amber-500"
      />

      {/* Arrow indicator */}
      <motion.div
        animate={ARROW_ANIMATION.animate}
        transition={ARROW_ANIMATION.transition}
      >
        <ArrowRight className="w-5 h-5 text-primary" />
      </motion.div>

      {/* Action step */}
      <AutomationStep
        step={automation.action}
        label="Then"
        iconBgColor="bg-primary/20"
        iconColor="text-primary"
      />
    </motion.div>
  );
};

interface AutomationStepProps {
  step: AutomationStep;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

const AutomationStep = ({
  step,
  label,
  iconBgColor,
  iconColor,
}: AutomationStepProps) => {
  const StepIcon = step.icon;

  return (
    <div className="flex-1 bg-secondary/50 rounded-xl p-4">
      <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center`}
        >
          <StepIcon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-sm font-medium">{step.text}</span>
      </div>
    </div>
  );
};

interface BenefitItemProps {
  benefit: string;
  index: number;
}

const BenefitItem = ({ benefit, index }: BenefitItemProps) => {
  const animationDelay = index * 0.1;

  return (
    <motion.li
      initial={FADE_IN_RIGHT.initial}
      whileInView={FADE_IN_RIGHT.whileInView}
      viewport={FADE_IN_RIGHT.viewport}
      transition={{ delay: animationDelay }}
      className="flex items-center gap-3 text-muted-foreground"
    >
      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      {benefit}
    </motion.li>
  );
};
