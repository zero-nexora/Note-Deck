import { PageBackground } from "@/components/workspace/page-background";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import WorkspaceList from "@/components/workspace/workspace-list";
import { Workspace } from "@/domain/types/workspace.type";
import { findWorkspacesByUserAction } from "../actions/workspace.action";
import { CreateWorkspace } from "@/components/workspace/create-workspace-item";

const WorkspacesPage = async () => {
  const result = await findWorkspacesByUserAction();

  const workspaces = (result.success ? result.data : []) as Workspace[];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <WorkspaceHeader />
          <WorkspaceList workspaces={workspaces} />
          <CreateWorkspace />
        </div>
      </div>
    </div>
  );
};

export default WorkspacesPage;
