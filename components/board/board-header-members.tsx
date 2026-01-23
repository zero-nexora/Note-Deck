"use client";

import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BoardHeaderMembersForm } from "./board-header-members-form";
import { useModal } from "@/stores/modal-store";
import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { User } from "@/domain/types/user.type";
import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { generateUserColor } from "@/lib/liveblocks";

interface BoardHeaderMembersProps {
  boardId: string;
  boardMembers: BoardWithListLabelsAndMembers["members"];
  user: User;
}

export const BoardHeaderMembers = ({
  boardId,
  boardMembers,
  user,
}: BoardHeaderMembersProps) => {
  const { open: openModal } = useModal();
  const { otherUsers } = useBoardRealtimePresence();

  const allUsers = [
    {
      id: user.id,
      name: user.name || "You",
      image: user.image,
      color: generateUserColor(user.id) || "#000000",
      isMe: true,
    },
    ...otherUsers.map((other) => ({
      id: other.user.id,
      name: other.user.name,
      image: other.user.image,
      color: other.user.color,
      isMe: false,
    })),
  ];

  const currentUserMember = boardMembers.find((m) => m.userId === user.id);
  const currentUserRole = currentUserMember?.role;

  if (allUsers.length === 0) return null;

  const handleViewDetailMember = () => {
    openModal({
      title: `People on this board (${allUsers.length})`,
      description: "Currently viewing this board in real time",
      children: (
        <BoardHeaderMembersForm
          boardId={boardId}
          boardMembers={boardMembers}
          membersOnline={allUsers}
          currentUserRole={currentUserRole}
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
        {allUsers.slice(0, 5).map((u) => (
          <Avatar key={u.id} className="h-7 w-7 ring-2 ring-card">
            {u.image ? <AvatarImage src={u.image} alt={u.name || ""} /> : null}
            <AvatarFallback
              className="text-xs font-medium text-white"
              style={{ backgroundColor: u.color }}
            >
              {(u.name || "U").charAt(0).toUpperCase()}
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
