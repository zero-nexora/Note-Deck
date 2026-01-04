"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { X } from "lucide-react";
import { useBoardMember } from "@/hooks/use-board-member";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useConfirm } from "@/stores/confirm-store";

interface BoardHeaderMembersFormProps {
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  membersOnline: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  }[];
  boardId: string;
}

export const BoardHeaderMembersForm = ({
  boardMembers: initialBoardMembers = [],
  membersOnline = [],
  boardId,
}: BoardHeaderMembersFormProps) => {
  const { changeRole, removeMember } = useBoardMember();
  const [boardMembers, setBoardMembers] = useState(initialBoardMembers);
  const { open } = useConfirm();

  useEffect(() => {
    setBoardMembers(initialBoardMembers);
  }, [initialBoardMembers]);

  const onlineUserIds = new Set(membersOnline.map((m) => m.id));

  const handleChangeRole = async (
    memberId: string,
    newRole: "admin" | "normal" | "observer"
  ) => {
    open({
      title: "Change role",
      description: "Are you sure you want to change role?",
      onConfirm: async () => {
        const member = await changeRole({
          boardId,
          userId: memberId,
          role: newRole,
        });
        if (member) {
          setBoardMembers((prev) =>
            prev.map((m) =>
              m.userId === member.userId ? { ...m, role: member.role } : m
            )
          );
        }
      },
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember({ boardId, userId: memberId });
    setBoardMembers((prev) => prev.filter((m) => m.userId !== memberId));
  };

  return (
    <div className="space-y-6">
      {membersOnline.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Currently viewing ({membersOnline.length})
            </h3>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              Online
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {membersOnline.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    {member.image ? (
                      <AvatarImage src={member.image} alt={member.name} />
                    ) : null}
                    <AvatarFallback
                      style={{ backgroundColor: member.color }}
                      className="text-white font-medium"
                    >
                      {(member.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: member.color }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">
          All board members ({boardMembers.length})
        </h3>

        <div className="space-y-2">
          {boardMembers.map((member) => {
            const isOnline = onlineUserIds.has(member.userId);

            return (
              <div
                key={member.id}
                className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 min-w-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-background">
                        {member.user.image ? (
                          <AvatarImage
                            src={member.user.image}
                            alt={member.user.name || ""}
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {(member.user.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="font-semibold text-foreground truncate">
                        {member.user.name || "Unnamed"}
                      </p>
                      {member.user.email && (
                        <p className="text-sm text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={
                            member.role === "admin" ? "default" : "secondary"
                          }
                          className={
                            member.role === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </Badge>
                        {isOnline && (
                          <Badge
                            variant="outline"
                            className="border-primary/50 text-primary"
                          >
                            Online now
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleChangeRole(
                          member.userId,
                          value as "admin" | "normal" | "observer"
                        )
                      }
                    >
                      <SelectTrigger className="w-[130px] bg-input border-border text-foreground focus:ring-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground border-border">
                        <SelectItem
                          value="admin"
                          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          Admin
                        </SelectItem>
                        <SelectItem
                          value="normal"
                          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          Member
                        </SelectItem>
                        <SelectItem
                          value="observer"
                          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          Observer
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.userId)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
