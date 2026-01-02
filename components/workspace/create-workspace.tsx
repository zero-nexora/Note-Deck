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
    <Button className="w-full py-10 flex items-center gap-4 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group bg-background" onClick={handleCreateWorkspace}>
      <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/30 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
        <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="flex-1 text-left">
        <h3 className="font-display font-semibold text-lg text-muted-foreground group-hover:text-foreground transition-colors">
          Create workspace
        </h3>
        <p className="text-sm text-muted-foreground">
          Start a new workspace from scratch
        </p>
      </div>
    </Button>
  );
}
