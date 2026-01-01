"use client";

import { useMemo, useState } from "react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useBoardMember } from "@/hooks/use-board-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Shield, Users } from "lucide-react";

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
    <div className="space-y-5">
      {selectedUserIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedUserIds.length} member
            {selectedUserIds.length > 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {availableMembers.map((member) => {
          const isSelected = selectedUserIds.includes(member.userId);

          return (
            <div
              key={member.userId}
              onClick={() => toggleUser(member.userId)}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-all",
                isSelected
                  ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
                  : "bg-secondary/30 border-border hover:bg-secondary/50"
              )}
            >
              <Checkbox checked={isSelected} className="shrink-0" />

              <Avatar className="h-10 w-10 border-2 border-border shrink-0">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {member.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-foreground truncate">
                  {member.user.name ?? "Unnamed user"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {member.user.email}
                </span>
              </div>
            </div>
          );
        })}

        {!availableMembers.length && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
              <Users className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              All workspace members are on this board
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Invite new members to your workspace first
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!!availableMembers.length && (
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Role
            </label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Full board access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Normal</span>
                    <span className="text-xs text-muted-foreground">
                      Standard access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="observer">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Observer</span>
                    <span className="text-xs text-muted-foreground">
                      Read-only access
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide opacity-0">
              Action
            </label>
            <Button
              onClick={handleSave}
              disabled={loading || !selectedUserIds.length}
              className="h-10 px-6"
            >
              {loading ? <Loading /> : `Add ${selectedUserIds.length || ""}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
