"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface FooterLinks {
  [category: string]: string[];
}

const FOOTER_LINKS: FooterLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Resources: [
    "Documentation",
    "API Reference",
    "Community",
    "Templates",
    "Blog",
  ],
  Company: ["About", "Careers", "Press Kit", "Contact", "Partners"],
  Legal: ["Privacy", "Terms", "Security", "GDPR", "Cookies"],
};

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const SOCIAL_ICON_HOVER = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 },
};

export const Footer = () => {
  return (
    <footer className="pt-16 pb-8 px-4 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand section */}
          <div className="col-span-2">
            <Link href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Flowboard</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              The modern project management platform built for real-time
              collaboration.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon key={social.label} social={social} />
              ))}
            </div>
          </div>

          {/* Footer link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <FooterLinkColumn
              key={category}
              category={category}
              links={links}
            />
          ))}
        </div>

        {/* Footer bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Flowboard. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  social: SocialLink;
}

const SocialIcon = ({ social }: SocialIconProps) => {
  const SocialIconComponent = social.icon;

  return (
    <motion.a
      href={social.href}
      whileHover={SOCIAL_ICON_HOVER.whileHover}
      whileTap={SOCIAL_ICON_HOVER.whileTap}
      className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
      aria-label={social.label}
    >
      <SocialIconComponent className="w-4 h-4" />
    </motion.a>
  );
};

interface FooterLinkColumnProps {
  category: string;
  links: string[];
}

const FooterLinkColumn = ({ category, links }: FooterLinkColumnProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-4">{category}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
