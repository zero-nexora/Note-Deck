import { useModal } from "@/stores/modal-store";
import { BoardInviteMemberForm } from "./board-invite-member-form";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";

interface BoardInviteMember {
  boardId: string;
  boardMembers: BoardWithListColumnLabelAndMember["members"];
  workspaceMembers: WorkspaceWithOwnerMembers["members"];
}

export const BoardInviteMember = ({
  boardId,
  boardMembers,
  workspaceMembers,
}: BoardInviteMember) => {
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
    <Button className="shrink-0" onClick={handleBoardInviteMember}>
      <UserPlus className="w-4 h-4 mr-2" />
      Invite
    </Button>
  );
};
