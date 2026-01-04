"use client";

import { BoardWithMember } from "@/domain/types/board.type";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Archive,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
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
      description:
        "Are you sure you want to delete this board? This action cannot be undone.",
      onConfirm: async () => {
        await deleteBoard({ id: board.id });
      },
    });
  };

  return (
    <Link href={`/workspaces/${board.workspaceId}/boards/${board.id}`}>
      <Card className="group border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200">
        <CardContent>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                {board.name}
              </h3>
              {board.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {board.description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-popover text-popover-foreground border-border"
              >
                <DropdownMenuItem
                  onClick={handleEdit}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {board.isArchived && (
            <Badge
              variant="secondary"
              className="mb-4 bg-secondary text-secondary-foreground"
            >
              <Archive className="h-3 w-3 mr-1" />
              Archived
            </Badge>
          )}

          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              {visibleMembers.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {visibleMembers.map((member) => (
                      <Avatar
                        key={member.id}
                        className="h-8 w-8 ring-2 ring-card"
                        title={member.user.name || member.user.email || ""}
                      >
                        <AvatarImage src={member.user.image || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(member.user)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {remainingMembers > 0 && (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-card">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{remainingMembers}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">No members</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {board.members.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(board.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
