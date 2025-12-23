"use client";

import { motion } from "framer-motion";
import { Calendar, Paperclip, MessageCircle, CheckSquare } from "lucide-react";

interface Checklist {
  done: number;
  total: number;
}

interface Card {
  title: string;
  labels: string[];
  labelColors: string[];
  dueDate?: string;
  checklist?: Checklist;
  comments?: number;
  attachments?: number;
  members?: number;
}

interface BoardList {
  title: string;
  cards: Card[];
}

const BOARD_LISTS: BoardList[] = [
  {
    title: "Backlog",
    cards: [
      {
        title: "Research competitor features",
        labels: ["Research"],
        labelColors: ["bg-blue-500"],
        dueDate: "Dec 10",
        comments: 3,
        attachments: 1,
        members: 1,
      },
      {
        title: "Define MVP scope",
        labels: ["Planning"],
        labelColors: ["bg-amber-500"],
        dueDate: "Dec 15",
        checklist: { done: 2, total: 5 },
        comments: 5,
        members: 2,
      },
    ],
  },
  {
    title: "In Progress",
    cards: [
      {
        title: "Design system setup",
        labels: ["Design", "Priority"],
        labelColors: ["bg-purple-500", "bg-red-500"],
        dueDate: "Dec 18",
        checklist: { done: 3, total: 6 },
        comments: 12,
        attachments: 4,
        members: 3,
      },
      {
        title: "API architecture",
        labels: ["Backend"],
        labelColors: ["bg-green-500"],
        dueDate: "Dec 12",
        comments: 6,
        members: 2,
      },
    ],
  },
  {
    title: "Review",
    cards: [
      {
        title: "Landing page redesign",
        labels: ["Design"],
        labelColors: ["bg-purple-500"],
        dueDate: "Dec 20",
        checklist: { done: 4, total: 7 },
        comments: 14,
        attachments: 5,
        members: 4,
      },
    ],
  },
  {
    title: "Done",
    cards: [
      {
        title: "User authentication",
        labels: ["Backend", "Security"],
        labelColors: ["bg-green-500", "bg-red-500"],
        dueDate: "Dec 05",
        checklist: { done: 8, total: 8 },
        comments: 10,
        attachments: 2,
        members: 2,
      },
      {
        title: "Database schema",
        labels: ["Backend"],
        labelColors: ["bg-green-500"],
        dueDate: "Dec 03",
        members: 1,
      },
    ],
  },
];

const TEAM_MEMBERS = [1, 2, 3, 4];

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const FADE_IN_UP_DELAYED = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const BoardShowcase = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={FADE_IN_UP.initial}
          whileInView={FADE_IN_UP.whileInView}
          viewport={FADE_IN_UP.viewport}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Powerful UI
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Intuitive boards designed for{" "}
            <span className="gradient-text">productivity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything your team needs, organized beautifully. Labels,
            checklists, due dates, and attachments—all at your fingertips.
          </p>
        </motion.div>

        {/* Board container */}
        <motion.div
          initial={FADE_IN_UP_DELAYED.initial}
          whileInView={FADE_IN_UP_DELAYED.whileInView}
          viewport={FADE_IN_UP_DELAYED.viewport}
          className="glass-panel p-6 overflow-x-auto glow-effect"
        >
          {/* Board header */}
          <BoardHeader />

          {/* Board lists */}
          <div className="flex gap-4 min-w-[800px]">
            {BOARD_LISTS.map((list, index) => (
              <BoardListColumn key={list.title} list={list} index={index} />
            ))}

            {/* Add list button */}
            <div className="w-72 shrink-0">
              <button className="w-full h-12 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors">
                + Add list
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BoardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6 min-w-[800px]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">P</span>
        </div>
        <h3 className="font-semibold text-lg">Product Launch 2024</h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Team Board
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member}
              className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent border-2 border-background"
            />
          ))}
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-secondary/50">
          + Invite
        </button>
      </div>
    </div>
  );
};

interface BoardListColumnProps {
  list: BoardList;
  index: number;
}

const BoardListColumn = ({ list, index }: BoardListColumnProps) => {
  const animationDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay }}
      className="w-72 shrink-0"
    >
      <div className="bg-secondary/30 rounded-xl p-3">
        {/* List header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="font-medium text-sm">{list.title}</h4>
          <span className="text-xs text-muted-foreground">
            {list.cards.length}
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          {list.cards.map((card) => (
            <BoardCard key={card.title} card={card} />
          ))}
        </div>

        {/* Add card button */}
        <button className="w-full mt-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
          + Add card
        </button>
      </div>
    </motion.div>
  );
};

interface BoardCardProps {
  card: Card;
}

const BoardCard = ({ card }: BoardCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border/50 rounded-lg p-3 cursor-pointer hover:border-primary/30 transition-all"
    >
      {/* Labels */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {card.labels.map((label, index) => (
          <span
            key={label}
            className={`${card.labelColors[index]} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Card title */}
      <p className="text-sm font-medium mb-3">{card.title}</p>

      {/* Card metadata */}
      <div className="flex items-center justify-between text-muted-foreground">
        <CardMetadata card={card} />
        {card.members && <CardMembers count={card.members} />}
      </div>
    </motion.div>
  );
};

interface CardMetadataProps {
  card: Card;
}

const CardMetadata = ({ card }: CardMetadataProps) => {
  return (
    <div className="flex items-center gap-3">
      {card.dueDate && (
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{card.dueDate}</span>
        </div>
      )}

      {card.checklist && (
        <div className="flex items-center gap-1 text-xs">
          <CheckSquare className="w-3 h-3" />
          <span>
            {card.checklist.done}/{card.checklist.total}
          </span>
        </div>
      )}

      {card.comments && (
        <div className="flex items-center gap-1 text-xs">
          <MessageCircle className="w-3 h-3" />
          <span>{card.comments}</span>
        </div>
      )}

      {card.attachments && (
        <div className="flex items-center gap-1 text-xs">
          <Paperclip className="w-3 h-3" />
          <span>{card.attachments}</span>
        </div>
      )}
    </div>
  );
};

interface CardMembersProps {
  count: number;
}

const CardMembers = ({ count }: CardMembersProps) => {
  return (
    <div className="flex -space-x-1">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-5 h-5 rounded-full bg-linear-to-br from-primary/60 to-accent/60 border border-card"
        />
      ))}
    </div>
  );
};
