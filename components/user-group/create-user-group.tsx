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
      variant="ghost"
      className="h-full min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 hover:bg-secondary/50 flex flex-col items-center justify-center gap-3 transition-all group"
      onClick={handleOpenCreateUserGroup}
    >
      <div className="w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Create new group
      </span>
    </Button>
  );
};
