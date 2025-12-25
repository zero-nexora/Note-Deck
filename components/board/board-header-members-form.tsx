import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useBoardMember } from "@/hooks/use-board-member";

interface BoardHeaderMembersFormProps {
  members: BoardWithListColumnLabelAndMember["members"];
}

export const BoardHeaderMembersForm = ({
  members,
}: BoardHeaderMembersFormProps) => {
  const {} = useBoardMember();

  const handleRemoveMember = async (memberId: string) => {};

  return (
    <div>
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
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
            <div>
              <p className="font-medium text-sm">{member.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {member.user.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveMember(member.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
