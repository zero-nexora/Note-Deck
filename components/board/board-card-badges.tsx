"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { MessageSquare, Paperclip, CheckSquare, Clock } from "lucide-react";
import { format, isToday, isTomorrow, isPast, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface BoardCardBadgesProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
}

export const BoardCardBadges = ({ card }: BoardCardBadgesProps) => {
  const hasDescription = !!card.description;
  const hasDueDate = !!card.dueDate;
  const hasComments = card.comments && card.comments.length > 0;
  const hasAttachments = card.attachments && card.attachments.length > 0;
  const hasChecklists = card.checklists && card.checklists.length > 0;

  const totalChecklistItems =
    card.checklists?.reduce(
      (sum, checklist) => sum + checklist.items.length,
      0
    ) || 0;

  const completedChecklistItems =
    card.checklists?.reduce(
      (sum, checklist) =>
        sum + checklist.items.filter((item) => item.isCompleted).length,
      0
    ) || 0;

  const allChecklistsCompleted =
    totalChecklistItems > 0 && completedChecklistItems === totalChecklistItems;

  const formatDueDate = (date: Date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    if (isThisWeek(dueDate)) return format(dueDate, "EEE");
    return format(dueDate, "MMM d");
  };

  const getDueDateStatus = (date: Date) => {
    const dueDate = new Date(date);

    if (isPast(dueDate) && !isToday(dueDate)) {
      return "overdue";
    }
    if (isToday(dueDate)) {
      return "due-soon";
    }
    return "normal";
  };

  const dueDateStatus = hasDueDate ? getDueDateStatus(card.dueDate!) : null;

  const badges = [];

  if (hasDueDate) {
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
        <span>{formatDueDate(card.dueDate!)}</span>
      </div>
    );
  }

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

  if (hasComments) {
    badges.push(
      <div
        key="comments"
        className="flex items-center gap-1 text-muted-foreground"
        title={`${card.comments.length} comment${
          card.comments.length > 1 ? "s" : ""
        }`}
      >
        <MessageSquare className="h-3 w-3" />
        <span className="text-xs">{card.comments.length}</span>
      </div>
    );
  }

  if (hasAttachments) {
    badges.push(
      <div
        key="attachments"
        className="flex items-center gap-1 text-muted-foreground"
        title={`${card.attachments.length} attachment${
          card.attachments.length > 1 ? "s" : ""
        }`}
      >
        <Paperclip className="h-3 w-3" />
        <span className="text-xs">{card.attachments.length}</span>
      </div>
    );
  }

  if (hasChecklists) {
    badges.push(
      <div
        key="checklist"
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          allChecklistsCompleted ? "text-primary" : "text-muted-foreground"
        )}
        title={`${completedChecklistItems}/${totalChecklistItems} checklist items completed`}
      >
        <CheckSquare className="h-3 w-3" />
        <span>
          {completedChecklistItems}/{totalChecklistItems}
        </span>
      </div>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex items-center gap-2 flex-wrap">{badges}</div>;
};
