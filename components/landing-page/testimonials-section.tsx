"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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
};

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Loved by <span className="gradient-text">thousands of teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the teams that have transformed their workflow with Flowboard.
          </p>
        </motion.div>

        {/* Testimonials grid */}
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
      transition={{ delay: animationDelay }}
      className="glass-panel p-6 card-hover relative"
    >
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
          <Star key={starIndex} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      {/* Testimonial content */}
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        &quot;{testimonial.content}&quot;
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent" />
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
