"use client";

import {
  createChecklistAction,
  updateChecklistAction,
  reorderChecklistAction,
  deleteChecklistAction,
} from "@/domain/actions/checklist.action";
import {
  CreateChecklistInput,
  UpdateChecklistInput,
  ReorderChecklistInput,
  DeleteChecklistInput,
} from "@/domain/schemas/checklist.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useChecklist() {
  const router = useRouter();

  const createChecklist = async (input: CreateChecklistInput) => {
    const result = await createChecklistAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const updateChecklist = async (id: string, input: UpdateChecklistInput) => {
    const result = await updateChecklistAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const reorderChecklist = async (input: ReorderChecklistInput) => {
    const result = await reorderChecklistAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const deleteChecklist = async (input: DeleteChecklistInput) => {
    const result = await deleteChecklistAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    createChecklist,
    updateChecklist,
    reorderChecklist,
    deleteChecklist,
  };
}
