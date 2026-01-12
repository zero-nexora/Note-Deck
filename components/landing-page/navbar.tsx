"use client";

import { useState } from "react";
import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import { Menu, X, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../common/theme-toggle";

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

const NAVBAR_ANIMATION = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.5,
    ease: cubicBezier(0.4, 0, 0.2, 1),
  },
};

const MOBILE_MENU_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: 0.2,
    ease: cubicBezier(0.4, 0, 0.2, 1),
  },
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = () => setIsOpen(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <motion.div
      initial={NAVBAR_ANIMATION.initial}
      animate={NAVBAR_ANIMATION.animate}
      transition={NAVBAR_ANIMATION.transition}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-md border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
          <Logo />
          <DesktopNavigation />
          <DesktopActions />
          <MobileMenuButton isOpen={isOpen} onToggle={toggleMobileMenu} />
        </nav>

        <MobileMenu isOpen={isOpen} onClose={closeMobileMenu} />
      </div>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group interactive">
      <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-button group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
        <Layers className="w-5 h-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-semibold gradient-text group-hover:text-shimmer">
        Flowboard
      </span>
    </Link>
  );
};

const DesktopNavigation = () => {
  return (
    <div className="hidden md:flex items-center gap-1">
      {NAV_LINKS.map((link, index) => (
        <Link
          key={link.name}
          href={link.href}
          className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="relative z-10">{link.name}</span>
          <span className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent transition-all duration-300 group-hover:shadow-sm" />
        </Link>
      ))}
    </div>
  );
};

const DesktopActions = () => {
  return (
    <div className="hidden md:flex items-center gap-3">
      <div className="animate-fade-in delay-300">
        <ThemeToggle />
      </div>

      <Link href="/sign-in" className="animate-fade-in delay-500">
        <Button variant={"outline"} className="px-5 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200 hover:bg-accent/80">
          Sign In
        </Button>
      </Link>

      <Link href="/sign-up" className="animate-fade-in delay-500">
        <Button className="btn-primary px-5 py-2 text-sm font-medium interactive shadow-button hover:shadow-glow">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <div className="flex items-center gap-3 md:hidden">
      <ThemeToggle />
      <Button
        onClick={onToggle}
        className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary border border-border/50 text-foreground transition-all duration-200 hover:shadow-glow interactive"
      >
        {isOpen ? (
          <X className="w-5 h-5 animate-scale-in" />
        ) : (
          <Menu className="w-5 h-5 animate-scale-in" />
        )}
      </Button>
    </div>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={MOBILE_MENU_ANIMATION.initial}
          animate={MOBILE_MENU_ANIMATION.animate}
          exit={MOBILE_MENU_ANIMATION.exit}
          transition={MOBILE_MENU_ANIMATION.transition}
          className="md:hidden mt-2 animate-fade-up"
        >
          <div className="glass-card p-4 backdrop-blur-md border-border/50 shadow-card">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 py-2.5 px-3 rounded-lg hover:bg-accent/80 interactive animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-linear-to-r from-transparent via-border to-transparent my-2" />

              <Link
                href="/sign-in"
                onClick={onClose}
                className="animate-fade-in delay-200"
              >
                <Button variant={"ghost"} className="w-full text-sm font-medium hover:bg-accent/80 transition-all duration-200">
                  Sign In
                </Button>
              </Link>

              <Link
                href="/sign-up"
                onClick={onClose}
                className="animate-fade-in delay-300"
              >
                <Button className="btn-primary w-full text-sm font-medium shadow-button hover:shadow-glow interactive">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
