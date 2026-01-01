"use server"

import {
  CreateAutomationInput,
  CreateAutomationSchema,
  UpdateAutomationInput,
  UpdateAutomationSchema,
  EnableAutomationInput,
  EnableAutomationSchema,
  DisableAutomationInput,
  DisableAutomationSchema,
  DeleteAutomationInput,
  DeleteAutomationSchema,
} from "@/domain/schemas/automation.schema";
import { automationService } from "@/domain/services/automation.service";
import { error, success } from "@/lib/response";
import { requireAuth } from "@/lib/session";

export const createAutomationAction = async (input: CreateAutomationInput) => {
  try {
    const user = await requireAuth();
    const parsed = CreateAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const automation = await automationService.create(user.id, parsed.data);
    return success("Automation created successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const findAutomationsByBoardIdAction = async (boardId: string) => {
  try {
    const user = await requireAuth();
    const automations = await automationService.findByBoardId(user.id, boardId);
    return success("", automations);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const updateAutomationAction = async (
  id: string,
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

    const automation = await automationService.update(user.id, id, parsed.data);
    return success("Automation updated successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const enableAutomationAction = async (input: EnableAutomationInput) => {
  try {
    const user = await requireAuth();
    const parsed = EnableAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const automation = await automationService.enable(user.id, parsed.data);
    return success("Automation enabled successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const disableAutomationAction = async (
  input: DisableAutomationInput
) => {
  try {
    const user = await requireAuth();
    const parsed = DisableAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    const automation = await automationService.disable(user.id, parsed.data);
    return success("Automation disabled successfully", automation);
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};

export const deleteAutomationAction = async (input: DeleteAutomationInput) => {
  try {
    const user = await requireAuth();
    const parsed = DeleteAutomationSchema.safeParse(input);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)[0]?.[0] ?? "Invalid input";
      return error(message);
    }

    await automationService.delete(user.id, parsed.data);
    return success("Automation deleted successfully");
  } catch (err: any) {
    return error(err.message ?? "Something went wrong");
  }
};
