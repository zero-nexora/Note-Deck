import { findUserGroupsByWorkspaceIdAction } from "@/domain/actions/user-group.action";
import { findWorkspaceByIdAction } from "@/domain/actions/workspace.action";
import { UserGroupsList } from "@/components/user-group/user-group-list";
import { unwrapActionResult } from "@/lib/response";
import { Shield } from "lucide-react";
import { CreatUserGroup } from "@/components/user-group/create-user-group";

interface UserGroupPageProps {
  params: Promise<{ workspaceId: string }>;
}

const UserGroupsPage = async ({ params }: UserGroupPageProps) => {
  const { workspaceId } = await params;

  const userGroups = unwrapActionResult(
    await findUserGroupsByWorkspaceIdAction({ workspaceId })
  );
  if (!userGroups) return null;

  const workspace = unwrapActionResult(
    await findWorkspaceByIdAction({ workspaceId })
  );
  if (!workspace) return null;

  const workspaceMembers = workspace.members || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            User Groups
          </h1>
          <p className="text-muted-foreground">
            Manage teams and their permissions in your workspace
          </p>
        </div>
        <CreatUserGroup workspaceId={workspaceId} />
      </div>
      <UserGroupsList
        workspaceMembers={workspaceMembers}
        userGroups={userGroups}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default UserGroupsPage;
