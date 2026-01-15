"use client";

import { WorkspaceMemberWithUser } from "@/domain/types/workspace-member.type";
import { Button } from "../ui/button";
import { useModal } from "@/stores/modal-store";
import { Users } from "lucide-react";
import { WorkspaceMemberListForm } from "./workspace-member-list-form";

interface WorkspaceMemberListProps {
  workspaceMembers: WorkspaceMemberWithUser[];
}

export const WorkspaceMemberList = ({
  workspaceMembers,
}: WorkspaceMemberListProps) => {
  const { open } = useModal();

  const handleOpenWorkspaceMemberList = () => {
    open({
      title: "Workspace Members",
      description: "View and manage workspace members",
      children: <WorkspaceMemberListForm workspaceMembers={workspaceMembers} />,
    });
  };

  return (
    <Button
      onClick={handleOpenWorkspaceMemberList}
      variant="outline"
      className="gap-2 border-border hover:bg-accent hover:text-accent-foreground"
    >
      <Users className="h-4 w-4" />
      <span>Members ({workspaceMembers.length})</span>
    </Button>
  );
};
