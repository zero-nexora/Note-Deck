"use client";

import {
  createCardAction,
  updateCardAction,
  moveCardAction,
  archiveCardAction,
  deleteCardAction,
} from "@/app/actions/card.action";
import { CreateCardInput, UpdateCardInput } from "@/domain/schemas/card.schema";
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

  const moveCard = async (input: {
    id: string;
    sourceListId: string;
    destinationListId: string;
    position: number;
  }) => {
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

  const archiveCard = async (id: string) => {
    try {
      const result = await archiveCardAction(id);

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

  const deleteCard = async (cardId: string) => {
    try {
      const result = await deleteCardAction(cardId);

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

    archiveCard,

    deleteCard,
  };
}
