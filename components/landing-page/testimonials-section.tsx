"use client";

import { motion } from "framer-motion";
import { Star, Quote, Users } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content:
      "Flowboard transformed how our team collaborates. The real-time features are game-changing—we cut our meeting time in half.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Lead",
    company: "StartupXYZ",
    content:
      "The automation rules alone save us hours every week. It's like having an extra team member handling all the routine tasks.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    company: "Creative Studio",
    content:
      "Finally, a project tool that designers actually want to use. Beautiful interface, intuitive workflows, and killer real-time collaboration.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Founder & CEO",
    company: "GrowthLabs",
    content:
      "We switched from three different tools to just Flowboard. Our team is more aligned and productive than ever.",
    rating: 5,
  },
];

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="section-padding px-4 relative overflow-hidden"
    >
      <div className="container-custom">
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          transition={FADE_IN_UP.transition}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by Teams
            </span>
          </div>
          <h2 className="text-heading mt-4 my-6">
            Loved by <span className="gradient-text">thousands of teams</span>
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Join the teams that have transformed their workflow with Flowboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={FADE_IN_UP.initial}
      whileInView={FADE_IN_UP.whileInView}
      viewport={FADE_IN_UP.viewport}
      transition={{ ...FADE_IN_UP.transition, delay: animationDelay }}
      className="glass-card p-6 relative group"
    >
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
          <Star key={starIndex} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        &quot;{testimonial.content}&quot;
      </p>

      <div className="flex items-center gap-3">
        <div
          className="avatar avatar-md"
          style={{
            background:
              "linear-gradient(135deg, hsl(262 83% 58%), hsl(262 90% 70%))",
          }}
        />
        <div>
          <div className="font-semibold text-sm">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
