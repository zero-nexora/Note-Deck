"use client";

import {
  changeWorkspacePlanAction,
  createWorkspaceAction,
  deleteWorkspaceAction,
  updateWorkspaceNameAction,
  updateWorkspaceSlugAction,
} from "@/app/actions/workspace.action";
import {
  ChangePlanInput,
  CreateWorkspaceInput,
  DeleteWorkspaceInput,
  UpdateWorkspaceNameInput,
  UpdateWorkspaceSlugInput,
} from "@/domain/schemas/workspace.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useWorkspace() {
  const router = useRouter();

  const createWorkspace = async (input: CreateWorkspaceInput) => {
    try {
      const result = await createWorkspaceAction(input);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(`/workspaces/${result.data!.id}`);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateNameWorkspace = async (
    id: string,
    input: UpdateWorkspaceNameInput
  ) => {
    try {
      const result = await updateWorkspaceNameAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateSlugWorkspace = async (
    id: string,
    input: UpdateWorkspaceSlugInput
  ) => {
    try {
      const result = await updateWorkspaceSlugAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const changePlan = async (id: string, input: ChangePlanInput) => {
    try {
      const result = await changeWorkspacePlanAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteWorkspace = async (input: DeleteWorkspaceInput) => {
    try {
      const result = await deleteWorkspaceAction(input);
      if (result.success) {
        toast.success(result.message);
        router.push("/workspaces");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    createWorkspace,
    updateNameWorkspace,
    updateSlugWorkspace,
    changePlan,
    deleteWorkspace,
  };
}
