"use client";

import {
  archiveCardAction,
  createCardAction,
  deleteCardAction,
  moveCardAction,
  reorderCardAction,
  restoreCardAction,
  updateCardAction,
} from "@/app/actions/card.action";
import {
  ArchiveCardInput,
  CreateCardInput,
  DeleteCardInput,
  MoveCardInput,
  ReorderCardInput,
  RestoreCardInput,
  UpdateCardInput,
} from "@/domain/schemas/card.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCard() {
  const router = useRouter();

  const createCard = async (input: CreateCardInput) => {
    try {
      const result = await createCardAction(input);
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

  const updateCard = async (id: string, input: UpdateCardInput) => {
    try {
      const result = await updateCardAction(id, input);
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

  const moveCard = async (input: MoveCardInput) => {
    try {
      const result = await moveCardAction(input);
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

  const reorderCard = async (input: ReorderCardInput) => {
    try {
      const result = await reorderCardAction(input);
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

  const archiveCard = async (input: ArchiveCardInput) => {
    try {
      const result = await archiveCardAction(input);
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

  const restoreCard = async (input: RestoreCardInput) => {
    try {
      const result = await restoreCardAction(input);
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

  const deleteCard = async (input: DeleteCardInput) => {
    try {
      const result = await deleteCardAction(input);
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
    createCard,
    updateCard,
    moveCard,
    reorderCard,
    archiveCard,
    restoreCard,
    deleteCard,
  };
}
