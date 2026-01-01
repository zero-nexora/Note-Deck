"use client";

import { BoardWithMember } from "@/domain/types/board.type";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Archive, Users, MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { useModal } from "@/stores/modal-store";
import { UpdateBoardForm } from "./update-board-form";
import { useConfirm } from "@/stores/confirm-store";
import { useBoard } from "@/hooks/use-board";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface BoardCardProps {
  board: BoardWithMember;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const { open: openModal } = useModal();
  const { open: openConfirm } = useConfirm();
  const { deleteBoard } = useBoard();

  const maxVisibleAvatars = 3;
  const remainingMembers = Math.max(
    0,
    board.members.length - maxVisibleAvatars
  );
  const visibleMembers = board.members.slice(0, maxVisibleAvatars);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal({
      title: "Edit Board",
      description: "Update your board details",
      children: <UpdateBoardForm board={board} />,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openConfirm({
      title: "Delete Board",
      description: "Are you sure you want to delete this board? This action cannot be undone.",
      onConfirm: async () => {
        await deleteBoard({ id: board.id });
      },
    });
  };

  return (
    <Link href={`/workspaces/${board.workspaceId}/boards/${board.id}`}>
      <Card className="h-full bg-card border border-border rounded-lg hover:border-primary/30 cursor-pointer">
        <CardContent className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground truncate">
                {board.name}
              </h3>
              {board.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {board.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badges */}
          {board.isArchived && (
            <Badge variant="secondary" className="text-xs">
              <Archive className="w-3 h-3 mr-1" />
              Archived
            </Badge>
          )}

          {/* Members */}
          <div className="flex items-center justify-between pt-2">
            {visibleMembers.length > 0 ? (
              <div className="flex items-center -space-x-2">
                {visibleMembers.map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-7 w-7 border-2 border-card ring-1 ring-border"
                    title={member.user.name || member.user.email || ""}
                  >
                    <AvatarImage
                      src={member.user.image || undefined}
                      alt={member.user.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                      {getInitials(member.user)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {remainingMembers > 0 && (
                  <div className="h-7 w-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                    +{remainingMembers}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs">No members</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span className="font-medium">{board.members.length}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border">
            <Clock className="w-3 h-3" />
            <span>Updated {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};