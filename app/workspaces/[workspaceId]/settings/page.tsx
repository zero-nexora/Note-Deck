import { findWorkspaceByIdAction } from "@/domain/actions/workspace.action";
import { SettingTabs } from "@/components/setting/setting-tabs";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { requireAuth } from "@/lib/session";
import { unwrapActionResult } from "@/lib/response";

interface SettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const SettingPage = async ({ params }: SettingsPageProps) => {
  const { workspaceId } = await params;
  const user = await requireAuth();

  const workspace = unwrapActionResult<WorkspaceWithOwnerMembers>(
    await findWorkspaceByIdAction({
      workspaceId,
    })
  );

  if (!workspace) return null;

  return <SettingTabs workspace={workspace} user={user} />;
};

export default SettingPage;
