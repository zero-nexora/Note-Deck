"use client";

import { useMemo, useState } from "react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { useBoardMember } from "@/hooks/use-board-member";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users } from "lucide-react";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useModal } from "@/stores/modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loading } from "../common/loading";

type Role = "admin" | "normal" | "observer";

interface BoardInviteMemberFormProps {
  boardId: string;
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardInviteMemberForm = ({
  boardId,
  boardMembers,
  workspaceMembers,
}: BoardInviteMemberFormProps) => {
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
    <div className="space-y-6">
      {selectedUserIds.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {selectedUserIds.length} member
            {selectedUserIds.length > 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {availableMembers.map((member) => {
          const isSelected = selectedUserIds.includes(member.userId);

          return (
            <div
              key={member.userId}
              onClick={() => toggleUser(member.userId)}
              className={`
                flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-primary bg-primary/5 hover:bg-primary/10"
                    : "border-border hover:bg-accent/50"
                }
              `}
            >
              <Checkbox
                checked={isSelected}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <Avatar className="h-10 w-10 ring-2 ring-background">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {member.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <span className="block font-medium text-foreground truncate">
                  {member.user.name ?? "Unnamed user"}
                </span>
                <span className="block text-sm text-muted-foreground truncate">
                  {member.user.email}
                </span>
              </div>
            </div>
          );
        })}

        {!availableMembers.length && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">
              All workspace members are on this board
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Invite new members to your workspace first
            </p>
          </div>
        )}
      </div>

      {!!availableMembers.length && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Role
            </label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            >
              <SelectTrigger className="bg-input border-border text-foreground focus:ring-ring">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                <SelectItem
                  value="admin"
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Full board access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="normal"
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Normal</span>
                    <span className="text-xs text-muted-foreground">
                      Standard access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="observer"
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Action
            </label>
            <Button
              onClick={handleSave}
              disabled={loading || !selectedUserIds.length}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loading /> : `Add ${selectedUserIds.length || ""}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
