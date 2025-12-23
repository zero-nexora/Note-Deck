"use server";

import { cardLabelService } from "@/domain/services/card-label.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";
import {
  CreateCardLabelInput,
  CreateCardLabelSchema,
} from "@/domain/schemas/card-label.schema";

export const addCardLabelAction = async (
  boardId: string,
  input: CreateCardLabelInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateCardLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const label = await cardLabelService.add(user.id, boardId, parsed.data);

    return success("Label added to card successfully", label);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeCardLabelAction = async (
  boardId: string,
  cardId: string,
  labelId: string
) => {
  try {
    const user = await requireAuth();

    await cardLabelService.remove(user.id, boardId, cardId, labelId);

    return success("Label removed from card successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
