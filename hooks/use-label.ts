"use client";

import {
  createLabelAction,
  updateLabelAction,
  deleteLabelAction,
} from "@/domain/actions/label.action";
import {
  CreateLabelInput,
  UpdateLabelInput,
  DeleteLabelInput,
} from "@/domain/schemas/label.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLabel() {
  const router = useRouter();

  const createLabel = async (input: CreateLabelInput) => {
    const result = await createLabelAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const updateLabel = async (id: string, input: UpdateLabelInput) => {
    const result = await updateLabelAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteLabel = async (input: DeleteLabelInput) => {
    const result = await deleteLabelAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
