import { useCallback } from "react";
import { Button } from "../ui/button";
import { BoardInviteMemberForm } from "./board-invite-member-form";
import { useModal } from "@/stores/modal-store";
import { UserPlus } from "lucide-react";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface BoardInviteMemberProps {
  boardId: string;
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardInviteMember = ({
  boardId,
  boardMembers,
  workspaceMembers,
}: BoardInviteMemberProps) => {
  const { open } = useModal();

  const handleBoardInviteMember = useCallback(() => {
    open({
      title: "Invite Members",
      description: "Invite members to your board",
      children: (
        <BoardInviteMemberForm
          boardId={boardId}
          boardMembers={boardMembers}
          workspaceMembers={workspaceMembers}
        />
      ),
    });
  }, [open, boardMembers, workspaceMembers, boardId]);

  return (
    <Button
      onClick={handleBoardInviteMember}
      size="sm"
      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
    >
      <UserPlus className="h-4 w-4" />
      Invite
    </Button>
  );
};
