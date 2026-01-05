"use client";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/stores/modal-store";
import { CreateAutomationForm } from "./create-automation-form";
import { LabelDetail } from "@/domain/types/label.type";
import { BoardWithUser } from "@/domain/types/board-member.type";

interface CreateAutomationProps {
  boardId: string;
  boardMembers: BoardWithUser[];
  labels: LabelDetail[];
}

export const CreateAutomation = ({
  boardId,
  boardMembers,
  labels,
}: CreateAutomationProps) => {
  const { open } = useModal();

  const handleOpenCreateAutomation = () => {
    open({
      title: "Create New Automation",
      description: "Automate your workflow with custom triggers and actions",
      children: (
        <CreateAutomationForm
          boardMembers={boardMembers}
          labels={labels}
          boardId={boardId}
        />
      ),
    });
  };

  return (
    <Button
      onClick={handleOpenCreateAutomation}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
    >
      <Plus className="h-4 w-4" />
      Create Automation
    </Button>
  );
};
