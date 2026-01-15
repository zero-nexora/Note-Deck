"use client";

import { MessageSquare, Paperclip, CheckSquare, Clock } from "lucide-react";
import { format, isToday, isTomorrow, isPast, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface BoardCardBadgesProps {
  card: {
    description: string | null;
    dueDate: Date | null;
    attachmentsCount: number;
    commentsCount: number;
    checklistsCount: number;
  };
}

export const BoardCardBadges = ({ card }: BoardCardBadgesProps) => {
  const hasDescription = !!card.description;
  const hasDueDate = !!card.dueDate;
  const hasComments = card.commentsCount > 0;
  const hasAttachments = card.attachmentsCount > 0;
  const hasChecklists = card.checklistsCount > 0;

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEE");
    return format(date, "MMM d");
  };

  const getDueDateStatus = (date: Date) => {
    if (isPast(date) && !isToday(date)) return "overdue";
    if (isToday(date)) return "due-soon";
    return "normal";
  };

  const dueDateStatus =
    hasDueDate && card.dueDate ? getDueDateStatus(card.dueDate) : null;

  const badges: React.ReactNode[] = [];

  /* Due date */
  if (hasDueDate && card.dueDate) {
    badges.push(
      <div
        key="due-date"
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
          dueDateStatus === "overdue" && "bg-destructive/10 text-destructive",
          dueDateStatus === "due-soon" && "bg-orange-500/10 text-orange-600",
          dueDateStatus === "normal" && "bg-muted text-muted-foreground"
        )}
      >
        <Clock className="h-3 w-3" />
        <span>{formatDueDate(card.dueDate)}</span>
      </div>
    );
  }

  /* Description */
  if (hasDescription) {
    badges.push(
      <div
        key="description"
        className="flex items-center justify-center h-6 w-6 text-muted-foreground"
        title="This card has a description"
      >
        <MessageSquare className="h-3 w-3" />
      </div>
    );
  }

  /* Comments */
  if (hasComments) {
    badges.push(
      <div
        key="comments"
        className="flex items-center gap-1 text-muted-foreground"
        title={`${card.commentsCount} comment${
          card.commentsCount > 1 ? "s" : ""
        }`}
      >
        <MessageSquare className="h-3 w-3" />
        <span className="text-xs">{card.commentsCount}</span>
      </div>
    );
  }

  /* Attachments */
  if (hasAttachments) {
    badges.push(
      <div
        key="attachments"
        className="flex items-center gap-1 text-muted-foreground"
        title={`${card.attachmentsCount} attachment${
          card.attachmentsCount > 1 ? "s" : ""
        }`}
      >
        <Paperclip className="h-3 w-3" />
        <span className="text-xs">{card.attachmentsCount}</span>
      </div>
    );
  }

  if (hasChecklists) {
    badges.push(
      <div
        key="checklists"
        className="flex items-center gap-1 text-muted-foreground text-xs"
        title={`${card.checklistsCount} checklist${
          card.checklistsCount > 1 ? "s" : ""
        }`}
      >
        <CheckSquare className="h-3 w-3" />
        <span>{card.checklistsCount}</span>
      </div>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex items-center gap-2 flex-wrap">{badges}</div>;
};
