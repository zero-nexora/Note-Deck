"use client";
import { useModal } from "@/stores/modal-store";
import { Plus } from "lucide-react";
import { CreateUserGroupForm } from "./create-user-group-form";
import { Button } from "../ui/button";

interface CreatUserGroupProps {
  workspaceId: string;
}

export const CreatUserGroup = ({ workspaceId }: CreatUserGroupProps) => {
  const { open } = useModal();

  const handleOpenCreateUserGroup = () => {
    open({
      title: "Create User Group",
      description: "Create a new group with custom permissions",
      children: <CreateUserGroupForm workspaceId={workspaceId} />,
    });
  };

  return (
    <Button
      variant="default"
      onClick={handleOpenCreateUserGroup}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
    >
      <Plus className="h-4 w-4" />
      <span className="font-medium">Create new group</span>
    </Button>
  );
};