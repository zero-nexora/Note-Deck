"use client";

import {
  createChecklistItemAction,
  toggleChecklistItemAction,
  updateChecklistItemAction,
  deleteChecklistItemAction,
  reorderChecklistItemAction,
} from "@/app/actions/checklist-item.action";
import {
  CreateChecklistItemInput,
  DeleteChecklistItemInput,
  ReorderChecklistItemInput,
  ToggleChecklistItemInput,
  UpdateChecklistItemInput,
} from "@/domain/schemas/check-list-item.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useChecklistItem() {
  const router = useRouter();

  const createChecklistItem = async (input: CreateChecklistItemInput) => {
    try {
      const result = await createChecklistItemAction(input);

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

  const toggleChecklistItem = async (input: ToggleChecklistItemInput) => {
    try {
      const result = await toggleChecklistItemAction(input);
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

  const updateChecklistItem = async (
    id: string,
    input: UpdateChecklistItemInput
  ) => {
    try {
      const result = await updateChecklistItemAction(id, input);
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

  const reorderChecklistItem = async (input: ReorderChecklistItemInput) => {
    try {
      const result = await reorderChecklistItemAction(input);
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

  const deleteChecklistItem = async (input: DeleteChecklistItemInput) => {
    try {
      const result = await deleteChecklistItemAction(input);
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

  return {
    createChecklistItem,

    toggleChecklistItem,

    updateChecklistItem,

    reorderChecklistItem,

    deleteChecklistItem,
  };
}
