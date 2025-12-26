"use client";
import {
  addCardLabelAction,
  removeCardLabelAction,
} from "@/app/actions/card-label.action";
import {
  AddCardLabelInput,
  RemoveCardLabelInput,
} from "@/domain/schemas/card-label.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCardLabel() {
  const router = useRouter();

  const addLabel = async (input: AddCardLabelInput) => {
    try {
      const result = await addCardLabelAction(input);
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

  const removeLabel = async (input: RemoveCardLabelInput) => {
    try {
      const result = await removeCardLabelAction(input);
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
    addLabel,
    removeLabel,
  };
}
