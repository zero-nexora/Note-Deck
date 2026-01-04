"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BoardCardMembersProps {
  members: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["members"];
}

export const BoardCardMembers = ({ members }: BoardCardMembersProps) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="flex -space-x-2">
      {members.slice(0, 4).map((member) => (
        <Avatar
          key={member.id}
          className="h-6 w-6 ring-2 ring-card"
          title={member.user.name || member.user.email || ""}
        >
          {member.user.image ? (
            <AvatarImage src={member.user.image} alt={member.user.name || ""} />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {member.user.name ? member.user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      ))}
      {members.length > 4 && (
        <div
          className="h-6 w-6 rounded-full bg-muted flex items-center justify-center ring-2 ring-card"
          title={`+${members.length - 4} more member${
            members.length - 4 > 1 ? "s" : ""
          }`}
        >
          <span className="text-[10px] font-medium text-muted-foreground">
            +{members.length - 4}
          </span>
        </div>
      )}
    </div>
  );
};
