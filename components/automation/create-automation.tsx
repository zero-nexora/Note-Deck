"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/stores/modal-store";
import { CreateAutomationForm } from "./create-automation-form";

interface CreateAutomationProps {
  boardId: string;
}

export const CreateAutomation = ({ boardId }: CreateAutomationProps) => {
  const { open } = useModal();

  const handleOpenCreateAutomation = () => {
    open({
      title: "Create New Automation",
      description: "Automate your workflow with custom triggers and actions",
      children: <CreateAutomationForm boardId={boardId} />,
    });
  };

  return (
    <Button
      className="h-10 shadow-lg hover:shadow-xl transition-shadow"
      onClick={handleOpenCreateAutomation}
    >
      <Plus className="w-4 h-4 mr-1.5" />
      Create Automation
    </Button>
  );
};
