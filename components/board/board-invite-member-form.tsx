"use client";

import { useMemo, useState } from "react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardMember } from "@/hooks/use-board-member";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/modal-store";
import { Loading } from "../common/loading";

type Role = "admin" | "normal" | "observer";

interface BoardInviteMemberInput {
  boardId: string;
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardInviteMemberForm = ({
  boardId,
  boardMembers,
  workspaceMembers,
}: BoardInviteMemberInput) => {
  const { addMember } = useBoardMember();
  const { close } = useModal();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [role, setRole] = useState<Role>("normal");
  const [loading, setLoading] = useState(false);

  const boardMemberUserIds = useMemo(
    () => new Set(boardMembers.map((m) => m.userId)),
    [boardMembers]
  );

  const availableMembers = useMemo(
    () =>
      workspaceMembers.filter(
        (member) => !boardMemberUserIds.has(member.userId)
      ),
    [workspaceMembers, boardMemberUserIds]
  );

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    if (!selectedUserIds.length) return;

    setLoading(true);

    await Promise.all(
      selectedUserIds.map((userId) =>
        addMember({
          boardId,
          userId,
          role,
        })
      )
    );

    close();
    setSelectedUserIds([]);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {availableMembers.map((member) => {
          const isSelected = selectedUserIds.includes(member.userId);

          return (
            <div
              key={member.userId}
              onClick={() => toggleUser(member.userId)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer border-b hover:bg-muted-foreground/10 transition-colors",
                isSelected && "bg-accent"
              )}
            >
              <Checkbox checked={isSelected} />

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {member.user.name ?? "Unnamed user"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {member.user.email}
                </span>
              </div>
            </div>
          );
        })}

        {!availableMembers.length && (
          <div className="text-sm text-muted-foreground">
            All workspace members are already in this board
          </div>
        )}
      </div>

      {!!availableMembers.length && (
        <div className="flex items-center justify-between gap-4">
          <Select
            value={role}
            onValueChange={(value) => setRole(value as Role)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="observer">Observer</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleSave}
            disabled={loading || !selectedUserIds.length}
          >
            {loading ? <Loading /> : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};
