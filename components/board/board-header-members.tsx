"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { BoardHeaderMembersForm } from "./board-header-members-form";

interface BoardHeaderMembersProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardHeaderMembers = ({ board }: BoardHeaderMembersProps) => {
  const { open: openModal } = useModal();

  const handleViewDetailMember = () => {
    openModal({
      title: `Board Members (${board.members.length})`,
      description: " Manage who has access to this board",
      children: <BoardHeaderMembersForm members={board.members} />,
    });
  };

  return (
    <Button onClick={handleViewDetailMember} variant={"ghost"}>
      <div className="flex -space-x-2">
        {board.members.slice(0, 5).map((member) => (
          <Avatar
            key={member.id}
            className="w-8 h-8 border-2 border-background ring-1 ring-border hover:z-10 transition-all"
          >
            {member.user.image ? (
              <AvatarImage
                src={member.user.image}
                alt={member.user.name || ""}
              />
            ) : null}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {(member.user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {board.members.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{board.members.length - 5}
          </div>
        )}
      </div>
      <Users className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
};
