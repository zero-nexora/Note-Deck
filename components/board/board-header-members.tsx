"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useModal } from "@/stores/modal-store";
import { BoardHeaderMembersForm } from "./board-header-members-form";
import { useOthers, useSelf } from "@/lib/liveblocks";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardHeaderMembersProps {
  boardId: string;
  boardMembers: BoardWithListColumnLabelAndMember["members"];
}

export const BoardHeaderMembers = ({
  boardId,
  boardMembers,
}: BoardHeaderMembersProps) => {
  const { open: openModal } = useModal();

  const others = useOthers();
  const self = useSelf();

  const allUsers = [
    ...(self
      ? [
          {
            connectionId: self.connectionId,
            user: self.presence.user,
            isMe: true,
          },
        ]
      : []),
    ...others.map((other) => ({
      connectionId: other.connectionId,
      user: other.presence.user,
      isMe: false,
    })),
  ];

  if (allUsers.length === 0) return null;

  const handleViewDetailMember = () => {
    openModal({
      title: `People on this board (${allUsers.length})`,
      description: "Currently viewing this board in real time",
      children: (
        <BoardHeaderMembersForm
          boardId={boardId}
          boardMembers={boardMembers}
          membersOnline={allUsers.map((u) => u.user)}
        />
      ),
    });
  };

  return (
    <Button
      onClick={handleViewDetailMember}
      variant={"ghost"}
      className="gap-2"
    >
      <div className="flex -space-x-2">
        {allUsers.slice(0, 5).map(({ connectionId, user }) => (
          <Avatar
            key={connectionId}
            className="w-8 h-8 border-2 border-background ring-1 ring-border hover:z-10 transition-all"
          >
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || ""} />
            ) : null}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {allUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{allUsers.length - 5}
          </div>
        )}
      </div>
      <Users className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
};
