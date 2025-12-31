"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BoardCardMembersProps {
  members: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["members"];
}

export const BoardCardMembers = ({ members }: BoardCardMembersProps) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="flex items-center -space-x-1.5 pt-1">
      {members.slice(0, 4).map((member) => (
        <Avatar
          key={member.id}
          className="w-7 h-7 border-2 border-card ring-1 ring-border transition-transform hover:scale-110 hover:z-10"
          title={member.user.name || member.user.email || ""}
        >
          {member.user.image ? (
            <AvatarImage src={member.user.image} alt={member.user.name || ""} />
          ) : null}
          <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
            {member.user.name ? member.user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      ))}
      {members.length > 4 && (
        <div
          className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted-foreground transition-transform hover:scale-110"
          title={`+${members.length - 4} more member${
            members.length - 4 > 1 ? "s" : ""
          }`}
        >
          +{members.length - 4}
        </div>
      )}
    </div>
  );
};
