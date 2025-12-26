import z from "zod";
import { JsonValue } from "./common.schem";

export const CreateAutomationSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().min(1),
  trigger: JsonValue.optional().default({}),
  actions: JsonValue.optional().default([]),
});

export const UpdateAutomationSchema = z.object({
  name: z.string().min(1).optional(),
  trigger: JsonValue.optional().default({}),
  actions: JsonValue.optional().default([]),
});

export const EnableAutomationSchema = z.object({
  id: z.string().min(1),
});

export const DisableAutomationSchema = z.object({
  id: z.string().min(1),
});

export const DeleteAutomationSchema = z.object({
  id: z.string().min(1),
});

export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
export type EnableAutomationInput = z.infer<typeof EnableAutomationSchema>;
export type DisableAutomationInput = z.infer<typeof DisableAutomationSchema>;
export type DeleteAutomationInput = z.infer<typeof DeleteAutomationSchema>;
