"use client";

import {
  createWorkspaceAction,
  updateWorkspaceAction,
} from "@/app/actions/workspace.action";
import { CreateWorkspaceInput } from "@/domain/schemas/workspace.schema";
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

  const updateWorkspace = async (id: string, input: CreateWorkspaceInput) => {
    try {
      const result = await updateWorkspaceAction(id, input);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return {
    createWorkspace,
    updateWorkspace,
  };
}
