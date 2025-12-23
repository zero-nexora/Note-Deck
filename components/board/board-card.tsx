"use client";

import { BoardWithMember } from "@/domain/types/board.type";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Archive, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { ActionsMenu } from "../common/actions-menu";
import { useModal } from "@/stores/modal-store";
import { UpdateBoardForm } from "./update-board-form";
import { useConfirm } from "@/stores/confirm-store";
import { useBoard } from "@/hooks/use-board";
import Link from "next/link";

interface BoardCardProps {
  board: BoardWithMember;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const { open: openModal } = useModal();
  const { open: openConfirm } = useConfirm();
  const { deleteBoard } = useBoard();

  const maxVisibleAvatars = 4;
  const remainingMembers = Math.max(
    0,
    board.members.length - maxVisibleAvatars
  );
  const visibleMembers = board.members.slice(0, maxVisibleAvatars);

  const handleEdit = () => {
    openModal({
      title: "",
      description: "",
      children: <UpdateBoardForm board={board} />,
    });
  };

  const handleDelete = () => {
    openConfirm({
      title: "Delete Board",
      description: "Are you sure you want to delete this board?",
      onConfirm: async () => {
        await deleteBoard(board.id);
      },
    });
  };

  return (
    <Link href={`/workspaces/${board.workspaceId}/boards/${board.id}`}>
      <Card className="glass-card h-36 border-0 cursor-pointer card-hover group relative overflow-hidden p-0">
        <CardContent className="relative z-10 h-full flex flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight truncate text-muted-foreground group-hover:glow-text transition-all">
                {board.name}
              </h3>
              {board.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug">
                  {board.description}
                </p>
              )}
              {board.isArchived && (
                <Badge
                  variant="secondary"
                  className="bg-muted/30 backdrop-blur-sm border-border/30"
                >
                  <Archive className="w-3 h-3" />
                </Badge>
              )}
            </div>

            <ActionsMenu onEdit={handleEdit} onDelete={handleDelete} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {visibleMembers.length > 0 ? (
                <div className="flex items-center -space-x-2">
                  {visibleMembers.map((member) => (
                    <Avatar
                      key={member.id}
                      className="w-8 h-8 border-2 border-background transition-transform hover:scale-110 hover:z-10 hover:-translate-y-0.5 duration-200"
                    >
                      <AvatarImage
                        src={member.user.image || undefined}
                        alt={member.user.name || "User"}
                      />
                      <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground text-xs font-semibold">
                        {getInitials(member.user)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingMembers > 0 && (
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-muted/80 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      +{remainingMembers}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-primary-foreground/60 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>No members</span>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground/70 font-medium">
              {board.members.length}{" "}
              {board.members.length === 1 ? "member" : "members"}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
