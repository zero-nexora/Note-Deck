"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkspaceTitleProps {
  name: string;
  plan?: string | null;
  onEdit: () => void;
}

export const WorkspaceTitle = ({ name, plan, onEdit }: WorkspaceTitleProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        onDoubleClick={onEdit}
        className="h-9 px-3 text-lg font-semibold"
      >
        {name}
      </Button>

      <Badge variant="secondary">{plan ?? "Free plan"}</Badge>
    </div>
  );
};
