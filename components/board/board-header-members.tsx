"use client";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BoardHeaderMembersForm } from "./board-header-members-form";
import { useOthers, useSelf } from "@/lib/liveblocks";
import { useModal } from "@/stores/modal-store";
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
      variant="ghost"
      size="sm"
      className="hover:bg-accent hover:text-accent-foreground gap-2"
    >
      <div className="flex -space-x-2">
        {allUsers.slice(0, 5).map(({ connectionId, user }) => (
          <Avatar key={connectionId} className="h-7 w-7 ring-2 ring-card">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name || ""} />
            ) : null}
            <AvatarFallback
              className="text-xs font-medium"
              style={{ backgroundColor: user.color }}
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {allUsers.length > 5 && (
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center ring-2 ring-card">
            <span className="text-xs font-medium text-muted-foreground">
              +{allUsers.length - 5}
            </span>
          </div>
        )}
      </div>
      <Users className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
};
