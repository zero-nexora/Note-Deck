"use client";

import {
  createCardAction,
  updateCardAction,
  moveCardAction,
  reorderCardsAction,
  archiveCardAction,
  restoreCardAction,
  deleteCardAction,
  duplicateCardAction,
  findCardByIdAction,
} from "@/domain/actions/card.action";
import {
  CreateCardInput,
  UpdateCardInput,
  MoveCardInput,
  ReorderCardsInput,
  ArchiveCardInput,
  RestoreCardInput,
  DeleteCardInput,
  DuplicateCardInput,
} from "@/domain/schemas/card.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCard() {
  const router = useRouter();

  const createCard = async (input: CreateCardInput) => {
    const result = await createCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const findCardById = async (cardId: string) => {
    const result = await findCardByIdAction(cardId);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    return result.data;
  };

  const updateCard = async (id: string, input: UpdateCardInput) => {
    const result = await updateCardAction(id, input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const moveCard = async (input: MoveCardInput) => {
    const result = await moveCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  const reorderCards = async (input: ReorderCardsInput) => {
    const result = await reorderCardsAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  const archiveCard = async (input: ArchiveCardInput) => {
    const result = await archiveCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const restoreCard = async (input: RestoreCardInput) => {
    const result = await restoreCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  const deleteCard = async (input: DeleteCardInput) => {
    const result = await deleteCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.refresh();
  };

  const duplicateCard = async (input: DuplicateCardInput) => {
    const result = await duplicateCardAction(input);
    if (!result.success) {
      toast.error(result.message);
      return null;
    }
    toast.success(result.message);
    router.refresh();
    return result.data;
  };

  return {
    createCard,
    updateCard,
    moveCard,
    reorderCards,
    archiveCard,
    restoreCard,
    deleteCard,
    duplicateCard,
    findCardById,
  };
}
