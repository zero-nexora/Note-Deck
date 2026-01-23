"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for individuals",
    features: ["5 Boards", "100 Cards", "Basic integrations"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Best for growing teams",
    features: [
      "Unlimited boards",
      "Advanced automation",
      "Priority support",
      "Analytics",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated support",
      "Custom contracts",
    ],
    popular: false,
  },
];

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const CARD_ANIMATION = {
  initial: { opacity: 0, y: 30 },
  spring: { type: "spring" as const, stiffness: 200, damping: 20 },
};

export const PricingPreviewSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="section-padding px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          ref={headerRef}
          initial={HEADER_ANIMATION.initial}
          animate={isHeaderInView ? HEADER_ANIMATION.animate : {}}
          transition={HEADER_ANIMATION.transition}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-heading my-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Choose the plan that fits your team. Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

const PricingCard = ({ plan, index }: PricingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const animationDelay = index * 0.12;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      ref={cardRef}
      initial={CARD_ANIMATION.initial}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: animationDelay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={CARD_ANIMATION.spring}
      >
        <Card
          className={`glass-card relative overflow-hidden h-full transition-all duration-300 ${
            plan.popular ? "border-primary/40 shadow-glow" : "border-border/30"
          }`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-bl-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </div>
          )}

          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              {plan.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-muted-foreground text-sm">
                {plan.period}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.popular ? "btn-primary" : "btn-secondary"
              }`}
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
