import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Plus, X } from "lucide-react";
import { useCardMember } from "@/hooks/use-card-member";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Badge } from "@/components/ui/badge";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardCardItemMembersProps {
  cardId: string;
  cardMembers: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["members"];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardCardItemMembers = ({
  cardId,
  cardMembers: initialCardMembers = [],
  boardMembers = [],
  realtimeUtils,
}: BoardCardItemMembersProps) => {
  const [cardMembers, setCardMembers] = useState(initialCardMembers);
  const [isAdding, setIsAdding] = useState(false);
  const { addCardMember, removeCardMember } = useCardMember();

  useEffect(() => {
    setCardMembers(initialCardMembers);
  }, [initialCardMembers]);

  const assignedUserIds = new Set(cardMembers.map((m) => m.user.id));

  const handleToggleMember = async (userId: string) => {
    const isAssigned = assignedUserIds.has(userId);

    if (isAssigned) {
      await removeCardMember({ cardId, userId });
      setCardMembers((prev) => prev.filter((m) => m.user.id !== userId));

      realtimeUtils.broadcastMemberUnassigned({
        cardId,
        memberId: userId,
      });
    } else {
      const newMembership = await addCardMember({ cardId, userId });
      if (newMembership) {
        const boardMember = boardMembers.find((m) => m.user.id === userId);
        if (boardMember) {
          setCardMembers((prev) => [
            ...prev,
            {
              id: newMembership.id,
              createdAt: newMembership.createdAt,
              cardId: newMembership.cardId,
              userId: newMembership.userId,
              user: boardMember.user,
            },
          ]);

          realtimeUtils.broadcastMemberAssigned({
            cardId,
            memberId: userId,
          });
        }
      }
      setIsAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Members</h3>
          {cardMembers.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-secondary text-secondary-foreground"
            >
              {cardMembers.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsAdding(!isAdding)}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {isAdding ? (
            <X className="h-4 w-4" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>

      {cardMembers.length > 0 && (
        <div className="p-4 space-y-2">
          {cardMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
            >
              <Avatar className="h-10 w-10 ring-2 ring-background">
                <AvatarImage src={member.user.image ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {member.user.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 font-medium text-foreground">
                {member.user.name ?? "Unknown"}
              </span>
              <button
                onClick={() => handleToggleMember(member.user.id)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <div className="p-4 space-y-2 border-t border-border bg-muted/30">
          {boardMembers
            .filter((m) => !assignedUserIds.has(m.user.id))
            .map((member) => (
              <Button
                key={member.id}
                variant="outline"
                size="sm"
                onClick={() => handleToggleMember(member.user.id)}
                className="w-full justify-start gap-3 border-border hover:bg-accent hover:text-accent-foreground"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {member.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {member.user.name ?? "Unknown"}
                </span>
              </Button>
            ))}
        </div>
      )}

      {cardMembers.length === 0 && !isAdding && (
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No members assigned yet
          </p>
        </div>
      )}
    </Card>
  );
};
