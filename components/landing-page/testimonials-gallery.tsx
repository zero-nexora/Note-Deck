"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content:
      "This tool transformed how our team collaborates. Real-time updates mean we're always in sync.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Lead",
    company: "StartupXYZ",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content:
      "The automation features alone saved us 10+ hours per week. Game changer for productivity.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    company: "Creative Studio",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content:
      "Beautiful interface and powerful features. Our design team adopted it instantly.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "CTO",
    company: "Innovation Labs",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content:
      "Enterprise-grade security with consumer-grade UX. Exactly what we needed.",
    rating: 5,
  },
];

export const TestimonialsGallery = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x: x * 10, y: y * 10 });
  };

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: -mousePosition.x, y: -mousePosition.y }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none"
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 glow-text">
            Loved by Teams Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what industry leaders are saying about our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
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

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const direction = index % 2 === 0 ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card p-6 rounded-2xl group"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30"
          >
            <motion.img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover"
              initial={{ filter: "blur(4px)" }}
              animate={{ filter: isHovered ? "blur(0px)" : "blur(0px)" }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <motion.div
            animate={{ scale: isHovered ? 1.2 : 1 }}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center"
          >
            <span className="text-[8px] text-white">✓</span>
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-foreground/90 text-sm leading-relaxed mb-3">
            &quot;{testimonial.content}
          </p>
          <div>
            <p className="font-semibold text-foreground font-display">
              {testimonial.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
