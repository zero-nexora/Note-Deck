"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CardItemProps {
  card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
  isDragging?: boolean;
  isPreview?: boolean;
}

export const CardItem = ({ card, isDragging, isPreview }: CardItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
    disabled: isPreview,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCardDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative bg-card rounded-lg border border-border/50 hover:border-border transition-all duration-200 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:-translate-y-0.5",
        isCardDragging && "opacity-40 shadow-xl scale-105 rotate-2",
        isPreview && "pointer-events-none opacity-70"
      )}
    >
      {card.coverImage && (
        <div className="relative w-full h-32 rounded-t-lg overflow-hidden bg-muted">
          <Image
            src={card.coverImage}
            alt={card.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
        </div>
      )}

      <div className={cn("p-3 space-y-2", card.coverImage && "pt-2")}>
        {card.labels && card.labels.length && (
          <div className="flex flex-wrap gap-1">
            {card.labels.slice(0, 4).map((label) => (
              <div
                key={label.id}
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${label.label.color}20`,
                  color: label.label.color,
                  border: `1px solid ${label.label.color}40`,
                }}
              >
                {label.label.name}
              </div>
            ))}
            {card.labels.length > 4 && (
              <div className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                +{card.labels.length - 4}
              </div>
            )}
          </div>
        )}

        <h4 className="font-medium text-sm text-card-foreground line-clamp-3 leading-snug">
          {card.title}
        </h4>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Due Date */}
          {card.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded",
                new Date(card.dueDate) < new Date()
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted"
              )}
            >
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(card.dueDate), "MMM d")}</span>
            </div>
          )}

          {/* Description indicator */}
          {card.description && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
            </div>
          )}

          {/* Checklist indicator (if you have this data) */}
          {/* <div className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            <span>2/5</span>
          </div> */}
        </div>

        {card.members && card.members.length && (
          <div className="flex items-center gap-1 pt-1">
            <div className="flex -space-x-2">
              {card.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  className="w-6 h-6 border-2 border-card ring-1 ring-background"
                >
                  {member.user.image ? (
                    <AvatarImage
                      src={member.user.image}
                      alt={member.user.name!}
                    />
                  ) : null}
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {member.user.name!.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {card.members.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  +{card.members.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
