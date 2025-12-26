"use server";
import {
  CreateLabelInput,
  CreateLabelSchema,
  DeleteLabelInput,
  DeleteLabelSchema,
  UpdateLabelInput,
  UpdateLabelSchema,
} from "@/domain/schemas/label.schema";
import { labelService } from "@/domain/services/label.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createLabelAction = async (input: CreateLabelInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const label = await labelService.create(user.id, parsed.data);
    return success("Label created successfully", label);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateLabelAction = async (
  id: string,
  input: UpdateLabelInput
) => {
  try {
    const user = await requireAuth();
    const parsed = UpdateLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const label = await labelService.update(user.id, id, parsed.data);
    return success("Label updated successfully", label);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteLabelAction = async (input: DeleteLabelInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteLabelSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await labelService.delete(user.id, parsed.data);
    return success("Label deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
