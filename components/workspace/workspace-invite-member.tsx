import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/stores/modal-store";
import { WorkspaceInviteMemberForm } from "../workspace/workspace-invite-member-form";

interface WorkspaceInviteMemberProps {
  workspaceId: string;
}

export const WorkspaceInviteMember = ({
  workspaceId,
}: WorkspaceInviteMemberProps) => {
  const { open } = useModal();

  const handleInviteMember = () => {
    open({
      title: "Invite Member",
      description: "Invite a member to join your workspace",
      children: <WorkspaceInviteMemberForm workspaceId={workspaceId} />,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleInviteMember}
      className="h-9 hover:bg-primary/10 hover:text-primary"
    >
      <UserPlus className="w-4 h-4 mr-1.5" />
      Invite
    </Button>
  );
};
