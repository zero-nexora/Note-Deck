"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Zap,
  Shield,
  CreditCard,
  Users,
  Layers,
  Settings,
  Cloud,
  LucideIcon,
} from "lucide-react";

interface FAQ {
  icon: LucideIcon;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    icon: Zap,
    question: "How does real-time collaboration work?",
    answer:
      "Our real-time engine syncs all changes instantly across all connected users. You'll see live cursors, typing indicators, and card movements as they happen—with no refresh needed.",
  },
  {
    icon: Users,
    question: "Can I invite external collaborators?",
    answer:
      "Yes! Pro and Enterprise plans support guest access. You can invite clients, contractors, or partners to specific boards without giving them access to your entire workspace.",
  },
  {
    icon: Shield,
    question: "Is my data secure?",
    answer:
      "Absolutely. We use end-to-end encryption, SOC 2 Type II compliance, and regular security audits. Enterprise plans include additional security features like SSO and audit logs.",
  },
  {
    icon: CreditCard,
    question: "Can I change plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade at any time. When upgrading, you get immediate access to new features. Downgrades take effect at the end of your billing cycle.",
  },
  {
    icon: Layers,
    question: "What integrations do you support?",
    answer:
      "Flowboard integrates with Slack, Microsoft Teams, Google Workspace, Zapier, and many more. Enterprise customers can also build custom integrations via our API.",
  },
  {
    icon: Settings,
    question: "How do automations work?",
    answer:
      "Create rules with triggers and actions. For example: 'When a card moves to Done, notify the team in Slack.' Pro plans include 250 automation runs per month, Enterprise is unlimited.",
  },
  {
    icon: Cloud,
    question: "Can I import from other tools?",
    answer:
      "Yes! We support imports from Trello, Asana, Monday.com, and Notion. Our import wizard preserves your board structure, cards, labels, and comments.",
  },
  {
    icon: HelpCircle,
    question: "What kind of support do you offer?",
    answer:
      "Free plans get community support. Pro plans include priority email support with 24-hour response times. Enterprise customers get dedicated support with phone access and SLAs.",
  },
];

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Flowboard.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  faq: FAQ;
  index: number;
}

const FAQItem = ({ faq, index }: FAQItemProps) => {
  const FAQIcon = faq.icon;

  return (
    <AccordionItem
      value={`item-${index}`}
      className="glass-panel border-none px-6 overflow-hidden"
    >
      <AccordionTrigger className="hover:no-underline py-5">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FAQIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold">{faq.question}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground pb-5 pl-14">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  );
};
