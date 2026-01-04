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
      variant="default"
      size="sm"
      onClick={handleInviteMember}
      className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
    >
      <UserPlus className="h-4 w-4" />
      <span className="font-medium">Invite</span>
    </Button>
  );
};
