"use client";

import {
  createChecklistItemAction,
  toggleChecklistItemAction,
  updateChecklistItemAction,
  reorderChecklistItemAction,
  deleteChecklistItemAction,
} from "@/domain/actions/checklist-item.action";
import {
  CreateChecklistItemInput,
  ToggleChecklistItemInput,
  UpdateChecklistItemInput,
  ReorderChecklistItemInput,
  DeleteChecklistItemInput,
} from "@/domain/schemas/checklist-item.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useChecklistItem() {
  const router = useRouter();

  const createChecklistItem = async (input: CreateChecklistItemInput) => {
    const result = await createChecklistItemAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const toggleChecklistItem = async (input: ToggleChecklistItemInput) => {
    const result = await toggleChecklistItemAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const updateChecklistItem = async (
    id: string,
    input: UpdateChecklistItemInput
  ) => {
    const result = await updateChecklistItemAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const reorderChecklistItem = async (input: ReorderChecklistItemInput) => {
    const result = await reorderChecklistItemAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  const deleteChecklistItem = async (input: DeleteChecklistItemInput) => {
    const result = await deleteChecklistItemAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    createChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    reorderChecklistItem,
    deleteChecklistItem,
  };
}
