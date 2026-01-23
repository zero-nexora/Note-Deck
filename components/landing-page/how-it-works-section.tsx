"use client";

import { easeInOut, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  UserPlus,
  Layout,
  Users,
  Rocket,
  LucideIcon,
  Route,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface MousePosition {
  x: number;
  y: number;
}

const STEPS: Step[] = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds with your email or social accounts.",
  },
  {
    icon: Layout,
    title: "Build Your Board",
    description: "Create lists, add cards, and organize your workflow.",
  },
  {
    icon: Users,
    title: "Invite Your Team",
    description: "Collaborate in real-time with unlimited team members.",
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "Ship faster and iterate with powerful automation.",
  },
];

const BOARD_COLUMNS = ["To Do", "In Progress", "Done"];
const WINDOW_CONTROLS_COLORS = [
  "bg-red-500/70",
  "bg-yellow-500/70",
  "bg-green-500/70",
];

const HEADER_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
};

const CARD_FLOAT_ANIMATION = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 4, repeat: Infinity, ease: easeInOut },
};

const LIVE_BADGE_ANIMATION = {
  animate: { y: [-3, 3, -3], x: [-2, 2, -2] },
  transition: { duration: 4, repeat: Infinity, ease: easeInOut },
};

export const HowItWorkSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section
      className="section-padding px-4 relative overflow-hidden"
      ref={containerRef}
    >
      <div className="container-custom">
        <motion.div
          initial={HEADER_ANIMATION.initial}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={HEADER_ANIMATION.transition}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Route className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              How It Works
            </span>
          </div>
          <h2 className="text-heading mt-6 mb-3">
            Get Started in <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Four simple steps to transform how your team works together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <DemoBoard
            imageRef={imageRef}
            mousePosition={mousePosition}
            isInView={isInView}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />

          <div className="space-y-6 order-1 lg:order-2">
            {STEPS.map((step, index) => (
              <StepItem
                key={step.title}
                step={step}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface DemoBoardProps {
  imageRef: React.RefObject<HTMLDivElement | null>;
  mousePosition: MousePosition;
  isInView: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const DemoBoard = ({
  imageRef,
  mousePosition,
  isInView,
  onMouseMove,
  onMouseLeave,
}: DemoBoardProps) => {
  return (
    <div
      ref={imageRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="perspective-1000 order-2 lg:order-1"
    >
      <motion.div
        animate={{
          rotateX: mousePosition.y * -10,
          rotateY: mousePosition.x * 10,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative transform-style-3d"
      >
        <motion.div
          animate={CARD_FLOAT_ANIMATION.animate}
          transition={CARD_FLOAT_ANIMATION.transition}
          className="glass-card p-6 rounded-xl"
        >
          <div className="bg-card/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {WINDOW_CONTROLS_COLORS.map((color, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${color}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                Project Dashboard
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {BOARD_COLUMNS.map((columnName, columnIndex) => (
                <BoardColumn
                  key={columnName}
                  columnName={columnName}
                  columnIndex={columnIndex}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={LIVE_BADGE_ANIMATION.animate}
          transition={LIVE_BADGE_ANIMATION.transition}
          className="absolute -top-3 -right-3 badge badge-success px-3 py-1 text-xs shadow-card"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1.5" />
          Live
        </motion.div>
      </motion.div>
    </div>
  );
};

interface BoardColumnProps {
  columnName: string;
  columnIndex: number;
  isInView: boolean;
}

const BoardColumn = ({
  columnName,
  columnIndex,
  isInView,
}: BoardColumnProps) => {
  const cardCount = 3 - columnIndex;

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
        {columnName}
      </div>
      {[...Array(cardCount)].map((_, cardIndex) => (
        <BoardColumnCard
          key={cardIndex}
          columnIndex={columnIndex}
          cardIndex={cardIndex}
          isInView={isInView}
        />
      ))}
    </div>
  );
};

interface BoardColumnCardProps {
  columnIndex: number;
  cardIndex: number;
  isInView: boolean;
}

const BoardColumnCard = ({
  columnIndex,
  cardIndex,
  isInView,
}: BoardColumnCardProps) => {
  const animationDelay = 0.4 + (columnIndex * 3 + cardIndex) * 0.08;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: animationDelay, duration: 0.3 }}
      className="bg-card/60 rounded-md p-2 border border-border/30"
    >
      <div className="h-1.5 w-3/4 bg-muted/60 rounded mb-1" />
      <div className="h-1 w-1/2 bg-muted/40 rounded" />
    </motion.div>
  );
};

interface StepItemProps {
  step: Step;
  index: number;
  isInView: boolean;
}

const StepItem = ({ step, index, isInView }: StepItemProps) => {
  const StepIcon = step.icon;
  const animationDelay = index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: animationDelay }}
      className="flex gap-4 group"
    >
      <div className="shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:shadow-glow transition-all duration-200"
        >
          <StepIcon className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-primary font-semibold">
            0{index + 1}
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            {step.title}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};
