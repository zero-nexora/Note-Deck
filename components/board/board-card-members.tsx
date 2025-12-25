"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BoardCardMembersProps {
  members: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["members"];
}

export const BoardCardMembers = ({ members }: BoardCardMembersProps) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="flex items-center gap-1 pt-1">
      <div className="flex -space-x-2">
        {members.slice(0, 3).map((member) => (
          <Avatar
            key={member.id}
            className="w-6 h-6 border-2 border-card ring-1 ring-background"
          >
            {member.user.image ? (
              <AvatarImage
                src={member.user.image}
                alt={member.user.name || ""}
              />
            ) : null}
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {member.user.name && member.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {members.length > 3 && (
          <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium text-muted-foreground">
            +{members.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};
