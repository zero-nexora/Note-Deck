"use server";

import {
  CreateAutomationInput,
  CreateAutomationSchema,
  UpdateAutomationInput,
  UpdateAutomationSchema,
} from "@/domain/schemas/automation.schema";
import { automationService } from "@/domain/services/automation.service";
import { requireAuth } from "@/lib/session";
import { error, success } from "@/lib/response";

export const createAutomationAction = async (
  input: CreateAutomationInput
) => {
  try {
    const user = await requireAuth();

    const parsed = CreateAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const automation = await automationService.create(
      user.id,
      parsed.data
    );

    return success("Automation created successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateAutomationAction = async (
  automationId: string,
  input: UpdateAutomationInput
) => {
  try {
    const user = await requireAuth();

    const parsed = UpdateAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const automation = await automationService.update(
      user.id,
      automationId,
      parsed.data
    );

    return success("Automation updated successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteAutomationAction = async (automationId: string) => {
  try {
    const user = await requireAuth();

    await automationService.delete(user.id, automationId);

    return success("Automation deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
