"use server";

import {
  CreateCardInput,
  CreateCardSchema,
  UpdateCardInput,
  UpdateCardSchema,
  MoveCardInput,
  MoveCardSchema,
  ArchiveCardInput,
  ArchiveCardSchema,
  RestoreCardInput,
  RestoreCardSchema,
  DeleteCardInput,
  DeleteCardSchema,
  ReorderCardsInput,
  ReorderCardsSchema,
  DuplicateCardInput,
  DuplicateCardSchema,
} from "@/domain/schemas/card.schema";
import { cardService } from "@/domain/services/card.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createCardAction = async (input: CreateCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.create(user.id, parsed.data);
    return success("Card created successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const findCardByIdAction = async (cardId: string) => {
  try {
    const user = await requireAuth();
    const card = await cardService.findById(user.id, cardId);
    return success("", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const updateCardAction = async (id: string, input: UpdateCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.update(user.id, id, parsed.data);
    return success("Card updated successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const moveCardAction = async (input: MoveCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = MoveCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.move(user.id, parsed.data);
    return success("Card moved successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const reorderCardsAction = async (input: ReorderCardsInput) => {
  try {
    const user = await requireAuth();
    const parsed = ReorderCardsSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await cardService.reorders(user.id, parsed.data);
    return success("Cards reordered successfully");
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const archiveCardAction = async (input: ArchiveCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = ArchiveCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.archive(user.id, parsed.data);
    return success("Card archived successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const restoreCardAction = async (input: RestoreCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = RestoreCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.restore(user.id, parsed.data);
    return success("Card restored successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const deleteCardAction = async (input: DeleteCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    await cardService.delete(user.id, parsed.data);
    return success("Card deleted successfully");
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};

export const duplicateCardAction = async (input: DuplicateCardInput) => {
  try {
    const user = await requireAuth();
    const parsed = DuplicateCardSchema.safeParse(input);
    if (!parsed.success) {
      const message =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        "Invalid input";
      return error(message);
    }
    const card = await cardService.duplicate(user.id, parsed.data);
    return success("Card duplicated successfully", card);
  } catch (e: any) {
    return error(e.message ?? "Something went wrong");
  }
};
