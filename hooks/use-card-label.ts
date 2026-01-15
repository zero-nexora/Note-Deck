"use client";

import {
  addCardLabelAction,
  removeCardLabelAction,
} from "@/domain/actions/card-label.action";
import {
  AddCardLabelInput,
  RemoveCardLabelInput,
} from "@/domain/schemas/card-label.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCardLabel() {
  const router = useRouter();

  const addCardLabel = async (input: AddCardLabelInput) => {
    const result = await addCardLabelAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const removeCardLabel = async (input: RemoveCardLabelInput) => {
    const result = await removeCardLabelAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
  };

  return {
    addCardLabel,
    removeCardLabel,
  };
}
