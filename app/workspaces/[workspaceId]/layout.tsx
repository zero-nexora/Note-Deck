import { listNotificationsAction } from "@/app/actions/notification.action";
import { findWorkspacesByUserAction } from "@/app/actions/workspace.action";
import { Navbar } from "@/components/workspace/navbar";
import { Sidebar } from "@/components/workspace/sidebar";
import { WorkspaceWithMember } from "@/domain/types/workspace.type";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

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

  const result = await findWorkspacesByUserAction();

  if (!result.success) return null;

  const resultNotification = await listNotificationsAction();

  const notifications = resultNotification.success
    ? resultNotification.data || []
    : [];

  const currentWorkspace = result.data!.find(
    (workspace: WorkspaceWithMember) => workspace.id === workspaceId
  );currentWorkspace

  if (!currentWorkspace) return null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar
        workspaceId={workspaceId}
        workspaces={result.data || []}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          notifications={notifications}
          workspace={currentWorkspace}
          user={user}
        />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default WorkspaceDetailLayout;
