"use client";

import { workspacePendingInvite } from "@/domain/types/workspace-invite.type";
import { Button } from "../ui/button";
import { useModal } from "@/stores/modal-store";
import { WorkspaceInviteListForm } from "./workspace-pending-invite-list-form";
import { Mail } from "lucide-react";

interface WorkspacePendingInviteMemberListProps {
  workspacePendingInvite: workspacePendingInvite[];
}

export const WorkspacePendingInviteList = ({
  workspacePendingInvite,
}: WorkspacePendingInviteMemberListProps) => {
  const { open } = useModal();

  const handleOpenWorkspaceInviteList = () => {
    open({
      title: "Pending Invitations",
      description: "View and manage pending workspace invitations",
      children: (
        <WorkspaceInviteListForm
          workspacePendingInvite={workspacePendingInvite}
        />
      ),
    });
  };

  return (
    <Button
      onClick={handleOpenWorkspaceInviteList}
      variant="outline"
      className="gap-2 border-border hover:bg-accent hover:text-accent-foreground"
    >
      <Mail className="h-4 w-4" />
      <span>Pending Invites ({workspacePendingInvite.length})</span>
    </Button>
  );
};
