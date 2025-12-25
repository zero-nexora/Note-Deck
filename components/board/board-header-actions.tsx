"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useBoardMember } from "@/hooks/use-board-member";

interface BoardHeaderActionsProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardHeaderActions = ({ board }: BoardHeaderActionsProps) => {
  const { inviteMember } = useBoardMember();

  const handleInvite = async () => {
    await inviteMember({
      boardId: board.id,
      userId: "f0f0a2d2-d7ab-4141-b7ee-3025252dc31d",
      role: "observer",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInvite();
    }
  };

  return (
    <Button
      className="btn-gradient shrink-0"
      onClick={handleInvite}
      onKeyDown={handleKeyDown}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      Invite
    </Button>
  );
};

{
  /* <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to Board</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on &ldquo;{board.name}&ldquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEmail("");
                setOpen(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleInvite} className="flex-1 btn-gradient">
              Send Invite
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Current members: {board.members.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {board.members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {member.user.name}
                </div>
              ))}
              {board.members.length > 5 && (
                <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  +{board.members.length - 5} more
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog> */
}
