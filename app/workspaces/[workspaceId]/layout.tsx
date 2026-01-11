import { listNotificationsAction } from "@/domain/actions/notification.action";
import { findWorkspacesByUserAction } from "@/domain/actions/workspace.action";
import { Navbar } from "@/components/workspace/navbar";
import { Sidebar } from "@/components/workspace/sidebar";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { unwrapActionResult } from "@/lib/response";

interface WorkspaceDetailPageProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceDetailLayout = async ({
  children,
  params,
}: WorkspaceDetailPageProps) => {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  const { workspaceId } = await params;
  if (!workspaceId) return redirect("/workspaces");

  const workspaces = unwrapActionResult(await findWorkspacesByUserAction());
  if (!workspaces) return null;

  const notifications =
    unwrapActionResult(await listNotificationsAction()) || [];

  const currentWorkspace = workspaces.find(
    (ws: WorkspaceWithMember) => ws.id === workspaceId
  );
  if (!currentWorkspace) return null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar workspaceId={workspaceId} workspaces={workspaces} />
      <div className="flex flex-1 h-full flex-col overflow-hidden">
        <Navbar
          notifications={notifications}
          workspace={currentWorkspace}
          user={user}
        />
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default WorkspaceDetailLayout;
