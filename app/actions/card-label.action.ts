"use server";
import {
  AddCardLabelInput,
  AddCardLabelSchema,
  RemoveCardLabelInput,
  RemoveCardLabelSchema,
} from "@/domain/schemas/card-label.schema";
import { cardLabelService } from "@/domain/services/card-label.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const addCardLabelAction = async (input: AddCardLabelInput) => {
  try {
    const user = await requireAuth();
    const parsed = AddCardLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const cardLabel = await cardLabelService.add(user.id, parsed.data);
    return success("Label added successfully", cardLabel);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const removeCardLabelAction = async (input: RemoveCardLabelInput) => {
  try {
    const user = await requireAuth();
    const parsed = RemoveCardLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await cardLabelService.remove(user.id, parsed.data);
    return success("Label removed successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
