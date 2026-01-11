"use client";

import {
  changeWorkspacePlanAction,
  createWorkspaceAction,
  deleteWorkspaceAction,
  updateWorkspaceNameAction,
} from "@/domain/actions/workspace.action";
import {
  ChangePlanInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  UpdateWorkspaceNameInput,
} from "@/domain/schemas/workspace.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspace() {
  const router = useRouter();

  const createWorkspace = async (input: CreateWorkspaceInput) => {
    const result = await createWorkspaceAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.push(`/workspaces/${result.data!.id}`);
    router.refresh();
  };

  const updateWorkspaceName = async (
    workspaceId: string,
    input: UpdateWorkspaceNameInput
  ) => {
    const result = await updateWorkspaceNameAction(workspaceId, input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const changeWorkspacePlan = async (
    workspaceId: string,
    input: ChangePlanInput
  ) => {
    const result = await changeWorkspacePlanAction(workspaceId, input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.refresh();
  };

  const deleteWorkspace = async (input: DeleteWorkspaceInput) => {
    const result = await deleteWorkspaceAction(input);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message);
    router.push("/workspaces");
    router.refresh();
  };

  return {
    createWorkspace,
    updateWorkspaceName,
    changeWorkspacePlan,
    deleteWorkspace,
  };
}
