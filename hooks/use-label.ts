"use client";
import {
  createLabelAction,
  deleteLabelAction,
  updateLabelAction,
} from "@/app/actions/label.action";
import {
  CreateLabelInput,
  DeleteLabelInput,
  UpdateLabelInput,
} from "@/domain/schemas/label.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLabel() {
  const router = useRouter();

  const createLabel = async (input: CreateLabelInput) => {
    try {
      const result = await createLabelAction(input);
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

  const updateLabel = async (id: string, input: UpdateLabelInput) => {
    try {
      const result = await updateLabelAction(id, input);
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

  const deleteLabel = async (input: DeleteLabelInput) => {
    try {
      const result = await deleteLabelAction(input);
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
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
