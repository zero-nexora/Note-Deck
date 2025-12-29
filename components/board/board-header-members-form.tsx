"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
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
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setBoardMembers(initialBoardMembers);
  }, [initialBoardMembers]);

  const onlineUserIds = new Set(membersOnline.map((m) => m.id));

  const handleChangeRole = async (
    memberId: string,
    newRole: "admin" | "normal" | "observer"
  ) => {
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
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember({ boardId, userId: memberId });
    setBoardMembers((prev) => prev.filter((m) => m.userId !== memberId));
  };

  return (
    <div className="space-y-8">
      {membersOnline.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">
              Currently viewing ({membersOnline.length})
            </h3>
            <Badge variant="secondary" className="text-xs">
              Online
            </Badge>
          </div>

          <div className="space-y-2">
            {membersOnline.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      {member.image ? (
                        <AvatarImage src={member.image} alt={member.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(member.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  </div>

                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">
          All board members ({boardMembers.length})
        </h3>

        <div className="space-y-2">
          {boardMembers.map((member) => {
            const isOnline = onlineUserIds.has(member.userId);

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      {member.user.image ? (
                        <AvatarImage
                          src={member.user.image}
                          alt={member.user.name || ""}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(member.user.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-sm">
                      {member.user.name || "Unnamed"}
                    </p>
                    {member.user.email && (
                      <p className="text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          member.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </Badge>
                      {isOnline && <Badge variant="outline">Online now</Badge>}
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
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="normal">Member</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.userId)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
