"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  transition: { duration: 0.5 },
};

const MOBILE_MENU_ANIMATION = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
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
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel px-6 py-3 flex items-center justify-between">
          <Logo />

          <DesktopNavigation />

          <DesktopActions />

          <MobileMenuButton isOpen={isOpen} onToggle={toggleMobileMenu} />
        </div>

        <MobileMenu isOpen={isOpen} onClose={closeMobileMenu} />
      </div>
    </motion.div>
  );
};

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Layers className="w-5 h-5 text-primary" />
      </div>
      <span className="text-xl font-bold text-foreground">Flowboard</span>
    </Link>
  );
};

const DesktopNavigation = () => {
  return (
    <div className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

const DesktopActions = () => {
  return (
    <div className="hidden md:flex items-center gap-3">
      <ThemeToggle />

      <Link href={"/sign-in"}>
        <Button className="rounded-full border border-primary/40 text-foreground bg-transparent px-6 py-2 font-medium transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
          Sign In
        </Button>
      </Link>

      <Link href={"/sign-up"}>
        <Button className="rounded-full bg-primary text-primary-foreground px-6 py-2 font-medium transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
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
      <Button
        onClick={onToggle}
        className="p-2 rounded-xl bg-secondary text-foreground"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          className="md:hidden mt-2 glass-panel p-4"
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-border" />

            <Link href={"/sign-in"}>
              <Button className="w-full rounded-full bg-transparent border border-primary/40 text-foreground px-6 py-2 font-medium transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
                Sign In
              </Button>
            </Link>

            <Link href={"/sign-up"}>
              <Button className="w-full rounded-full bg-linear-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsl(270_70%_60%/0.5)] focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
