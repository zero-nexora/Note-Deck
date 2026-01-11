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
    if (result.success) {
      toast.success(result.message);
      router.refresh();
      return result.data;
    } else {
      toast.error(result.message);
      return null;
    }
  };

  const updateLabel = async (id: string, input: UpdateLabelInput) => {
    const result = await updateLabelAction(id, input);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const deleteLabel = async (input: DeleteLabelInput) => {
    const result = await deleteLabelAction(input);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  return {
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
