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
          "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium transition-colors",
          dueDateStatus === "overdue" &&
            "bg-destructive text-destructive-foreground",
          dueDateStatus === "due-soon" && "bg-yellow-500 text-white",
          dueDateStatus === "normal" &&
            "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        <Clock className="w-3 h-3" />
        <span>{formatDueDate(card.dueDate!)}</span>
      </div>
    );
  }

  if (hasDescription) {
    badges.push(
      <div
        key="description"
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:bg-muted transition-colors"
        title="This card has a description"
      >
        <MessageSquare className="w-3 h-3" />
      </div>
    );
  }

  if (hasComments) {
    badges.push(
      <div
        key="comments"
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:bg-muted transition-colors"
        title={`${card.comments.length} comment${
          card.comments.length > 1 ? "s" : ""
        }`}
      >
        <MessageSquare className="w-3 h-3" />
        <span className="font-medium">{card.comments.length}</span>
      </div>
    );
  }

  if (hasAttachments) {
    badges.push(
      <div
        key="attachments"
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-muted-foreground hover:bg-muted transition-colors"
        title={`${card.attachments.length} attachment${
          card.attachments.length > 1 ? "s" : ""
        }`}
      >
        <Paperclip className="w-3 h-3" />
        <span className="font-medium">{card.attachments.length}</span>
      </div>
    );
  }

  if (hasChecklists) {
    badges.push(
      <div
        key="checklist"
        className={cn(
          "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium transition-colors",
          allChecklistsCompleted
            ? "bg-green-500 text-white"
            : "text-muted-foreground hover:bg-muted"
        )}
        title={`${completedChecklistItems}/${totalChecklistItems} checklist items completed`}
      >
        <CheckSquare className="w-3 h-3" />
        <span>
          {completedChecklistItems}/{totalChecklistItems}
        </span>
      </div>
    );
  }

  if (badges.length === 0) return null;

  return <div className="flex flex-wrap items-center gap-1">{badges}</div>;
};
