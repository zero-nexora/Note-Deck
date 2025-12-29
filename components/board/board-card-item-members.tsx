import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Plus, X } from "lucide-react";
import { useCardMember } from "@/hooks/use-card-member";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Badge } from "@/components/ui/badge";

interface BoardCardItemMembersProps {
  cardId: string;
  cardMembers: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]["members"];
  boardMembers: BoardWithListColumnLabelAndMember["members"];
}

export const BoardCardItemMembers = ({
  cardId,
  cardMembers: initialCardMembers = [],
  boardMembers = [],
}: BoardCardItemMembersProps) => {
  const [cardMembers, setCardMembers] = useState(initialCardMembers);
  const [isAdding, setIsAdding] = useState(false);
  const { addMember, removeMember } = useCardMember();

  useEffect(() => {
    setCardMembers(initialCardMembers);
  }, [initialCardMembers]);

  const assignedUserIds = new Set(cardMembers.map((m) => m.user.id));

  const handleToggleMember = async (userId: string) => {
    const isAssigned = assignedUserIds.has(userId);

    if (isAssigned) {
      await removeMember({ cardId, userId });
      setCardMembers((prev) => prev.filter((m) => m.user.id !== userId));
    } else {
      const newMembership = await addMember({ cardId, userId });
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
        }
      }
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-5 bg-card border-border/60">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Members</h3>
            {cardMembers.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {cardMembers.length}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 hover:bg-primary/10 hover:text-primary"
          >
            {isAdding ? (
              <X className="h-4 w-4" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1.5" />
                Add
              </>
            )}
          </Button>
        </div>

        {cardMembers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cardMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {member.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {member.user.name ?? "Unknown"}
                </span>
                <button
                  onClick={() => handleToggleMember(member.user.id)}
                  className="opacity-0 group-hover:opacity-100 ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isAdding && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            {boardMembers
              .filter((m) => !assignedUserIds.has(m.user.id))
              .map((member) => (
                <Button
                  key={member.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleMember(member.user.id)}
                  className="justify-start h-auto py-2 hover:bg-primary/5 hover:border-primary/50"
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={member.user.image ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {member.user.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">
                    {member.user.name ?? "Unknown"}
                  </span>
                </Button>
              ))}
          </div>
        )}

        {cardMembers.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No members assigned yet
          </p>
        )}
      </div>
    </Card>
  );
};
