"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/stores/modal-store";
import { useCallback } from "react";
import { CreateWorkspaceForm } from "./create-workspace-form";

export function CreateWorkspace() {
  const { open } = useModal();

  const handleCreateWorkspace = useCallback(() => {
    open({
      title: "Create New Workspace",
      description: "Add a new workspace to organize your work",
      children: <CreateWorkspaceForm />,
    });
  }, [open]);

  return (
    <Button
      onClick={handleCreateWorkspace}
      className="w-full h-auto py-6 border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent transition-all duration-200 group bg-card"
      variant="outline"
    >
      <div className="flex items-center gap-4 w-full">
        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Plus className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1 text-left">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            Create workspace
          </h3>
          <p className="text-sm text-muted-foreground">
            Start a new workspace from scratch
          </p>
        </div>
      </div>
    </Button>
  );
}
