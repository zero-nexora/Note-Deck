"use client";
import {
  createChecklistAction,
  updateChecklistAction,
  reorderChecklistAction,
  deleteChecklistAction,
} from "@/app/actions/checklist.action";
import {
  CreateChecklistInput,
  UpdateChecklistInput,
  ReorderChecklistInput,
  DeleteChecklistInput,
} from "@/domain/schemas/check-list.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useChecklist() {
  const router = useRouter();

  const createChecklist = async (input: CreateChecklistInput) => {
    try {
      const result = await createChecklistAction(input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateChecklist = async (id: string, input: UpdateChecklistInput) => {
    try {
      const result = await updateChecklistAction(id, input);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return result.data
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const reorderChecklist = async (input: ReorderChecklistInput) => {
    try {
      const result = await reorderChecklistAction(input);
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

  const deleteChecklist = async (input: DeleteChecklistInput) => {
    try {
      const result = await deleteChecklistAction(input);
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
    createChecklist,
    updateChecklist,
    reorderChecklist,
    deleteChecklist,
  };
}
