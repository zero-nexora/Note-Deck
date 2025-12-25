"use client";
import { Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BoardCardMetaProps {
  dueDate: Date | null;
  hasDescription: boolean;
}

export const BoardCardMeta = ({
  dueDate,
  hasDescription,
}: BoardCardMetaProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      {dueDate && (
        <div
          className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded",
            new Date(dueDate) < new Date()
              ? "bg-destructive/10 text-destructive"
              : "bg-muted"
          )}
        >
          <Calendar className="w-3 h-3" />
          <span>{format(new Date(dueDate), "MMM d")}</span>
        </div>
      )}

      {hasDescription && (
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};
