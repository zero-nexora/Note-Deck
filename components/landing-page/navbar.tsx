"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../common/theme-toggle";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel px-6 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Flowboard</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Button className="rounded-full border border-primary/40 text-foreground bg-transparent px-6 py-2 font-medium transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
              Sign In
            </Button>

            <Button className="rounded-full bg-primary text-primary-foreground px-6 py-2 font-medium transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
              Sign Up
            </Button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-secondary text-foreground"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 glass-panel p-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-border" />
                <Button className="w-full rounded-full bg-transparent border border-primary/40 text-foreground px-6 py-2 font-medium transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
                  Sign In
                </Button>

                <Button className="w-full rounded-full bg-linear-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
                  Get Started Free
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
