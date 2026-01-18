import {
  findWorkspaceByIdAction,
  findWorkspaceLimitAction,
} from "@/domain/actions/workspace.action";
import { SettingTabs } from "@/components/setting/setting-tabs";
import { WorkspaceWithOwnerMembers } from "@/domain/types/workspace.type";
import { requireAuth } from "@/lib/session";
import { unwrapActionResult } from "@/lib/response";

interface SettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const SettingPage = async ({ params }: SettingsPageProps) => {
  const { workspaceId } = await params;

  const userPromise = requireAuth();
  const workspacePromise = findWorkspaceByIdAction({ workspaceId });
  const workspaceLimitPromise = findWorkspaceLimitAction({ workspaceId });

  const [user, workspaceResult, workspaceLimitResult] = await Promise.all([
    userPromise,
    workspacePromise,
    workspaceLimitPromise,
  ]);

  const workspace =
    unwrapActionResult<WorkspaceWithOwnerMembers>(workspaceResult);
  if (!workspace) return null;

  const workspaceLimits = unwrapActionResult(workspaceLimitResult);
  if (!workspaceLimits) return null;

  return (
    <SettingTabs
      workspace={workspace}
      user={user}
      workspaceLimits={workspaceLimits}
    />
  );
};

export default SettingPage;
