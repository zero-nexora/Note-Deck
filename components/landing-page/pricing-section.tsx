"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals getting started",
    features: [
      "Up to 10 boards",
      "Unlimited cards",
      "Basic real-time sync",
      "1GB storage",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per user/month",
    description: "For teams that need more power",
    features: [
      "Unlimited boards",
      "Advanced automations",
      "Priority real-time sync",
      "20GB storage",
      "Priority support",
      "Custom fields",
      "Timeline view",
      "Guest access",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "SSO/SAML",
      "Advanced permissions",
      "Unlimited storage",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const BUTTON_HOVER = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container-custom relative">
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          transition={FADE_IN_UP.transition}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-heading mt-4 mb-6">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <PricingPlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface PricingPlanCardProps {
  plan: PricingPlan;
  index: number;
}

const PricingPlanCard = ({ plan, index }: PricingPlanCardProps) => {
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={FADE_IN_UP.initial}
      whileInView={FADE_IN_UP.whileInView}
      viewport={FADE_IN_UP.viewport}
      transition={{ ...FADE_IN_UP.transition, delay: animationDelay }}
      className={`relative glass-card p-8 ${
        plan.popular ? "border-primary/40 shadow-glow" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="badge badge-primary flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">{plan.price}</span>
        <span className="text-muted-foreground text-sm ml-2">
          /{plan.period}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={BUTTON_HOVER.whileHover}
        whileTap={BUTTON_HOVER.whileTap}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
          plan.popular ? "btn-primary" : "btn-secondary"
        }`}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
};
