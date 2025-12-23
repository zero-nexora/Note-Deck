"use server";

import {
  CreateCardInput,
  CreateCardSchema,
  UpdateCardInput,
  UpdateCardSchema,
} from "@/domain/schemas/card.schema";
import { cardService } from "@/domain/services/card.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createCardAction = async (input: CreateCardInput) => {
  try {
    const user = await requireAuth();

    const parsed = CreateCardSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const card = await cardService.create(user.id, parsed.data);

    return success("Card created successfully", card);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const getCardByIdAction = async (id: string) => {
  try {
    const user = await requireAuth();

    const card = await cardService.getById(user.id, id);

    return success("", card);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateCardAction = async (id: string, input: UpdateCardInput) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateCardSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const card = await cardService.update(user.id, id, parsed.data);

    return success("Card updated successfully", card);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const moveCardAction = async (input: {
  id: string;
  sourceListId: string;
  destinationListId: string;
  position: number;
}) => {
  try {
    const user = await requireAuth();

    if (!input.id) return error("Card id is required");

    const card = await cardService.move(
      user.id,
      input.id,
      input.sourceListId,
      input.destinationListId,
      input.position
    );

    return success("Card moved successfully", card);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const archiveCardAction = async (id: string) => {
  try {
    const user = await requireAuth();

    const card = await cardService.archive(user.id, id);

    return success("Card archived successfully", card);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteCardAction = async (cardId: string) => {
  try {
    const user = await requireAuth();

    await cardService.delete(user.id, cardId);

    return success("Card deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
