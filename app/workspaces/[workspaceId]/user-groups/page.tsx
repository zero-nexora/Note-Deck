import { findUserGroupsByWorkspaceAction } from "@/app/actions/user-group.action";
import { findWorkspaceByIdAction } from "@/app/actions/workspace.action";
import { UserGroupsList } from "@/components/user-group/user-group-list";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";

interface UserGroupPageProps {
  params: Promise<{ workspaceId: string }>;
}

const UserGroupsPage = async ({ params }: UserGroupPageProps) => {
  const { workspaceId } = await params;

  const result = await findUserGroupsByWorkspaceAction(workspaceId);
  if (!result.success || !result.data) return null;

  const userGroup = result.data;

  const resultWorkspaceMember = await findWorkspaceByIdAction(workspaceId);
  if (!resultWorkspaceMember.success) return null;

  const workspaceMembers =
    (resultWorkspaceMember.data as WorkspaceWithOwnerMembers).members || [];

  return (
    <div>
      <UserGroupsList
        workspaceMembers={workspaceMembers}
        userGroups={userGroup}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default UserGroupsPage;
