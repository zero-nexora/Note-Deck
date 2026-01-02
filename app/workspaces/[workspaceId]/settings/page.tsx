import { findWorkspaceByIdAction } from "@/app/actions/workspace.action";
import { SettingTabs } from "@/components/setting/setting-tabs";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { requireAuth } from "@/lib/session";

interface SettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const SettingPage = async ({ params }: SettingsPageProps) => {
  const { workspaceId } = await params;
  const user = await requireAuth();

  const result = await findWorkspaceByIdAction(workspaceId);
  if (!result.success || !result.data) return null;

  const workspace = result.data as WorkspaceWithOwnerMembers;

  return (
    <div>
      <SettingTabs workspace={workspace} user={user} />
    </div>
  );
};

export default SettingPage;
