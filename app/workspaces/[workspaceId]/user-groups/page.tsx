import { findUserGroupsByWorkspaceAction } from "@/app/actions/user-group.action";
import { UserGroupsList } from "@/components/user-group/user-group-list";

interface UserGroupPageProps {
  params: Promise<{ workspaceId: string }>;
}

const UserGroupsPage = async ({ params }: UserGroupPageProps) => {
  const { workspaceId } = await params;

  const result = await findUserGroupsByWorkspaceAction(workspaceId);
  if (!result.success || !result.data) return null;

  const userGroup = result.data;

  return (
    <div>
      <UserGroupsList userGroups={userGroup} workspaceId={workspaceId} />
    </div>
  );
};

export default UserGroupsPage;
