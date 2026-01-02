"use client";

import { Workspace } from "@/domain/types/workspace.type";
import { WorkspaceItem } from "./workspace-item";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="space-y-3">
      {workspaces.map((workspace) => (
        <WorkspaceItem key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
