import { Workspace } from "@/domain/types/workspace.type";
import { WorkspaceItem } from "./workspace-item";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceItem key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
