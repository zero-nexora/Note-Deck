import { z } from "zod";
import { NewAutomation, UpdateAutomation } from "../types/automation.type";

export const CreateAutomationSchema: z.ZodType<NewAutomation> = z.object({
  boardId: z.string(),
  name: z.string(),
  trigger: z.record(z.string(), z.any()),
  actions: z.record(z.string(), z.any()),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateAutomationSchema: z.ZodType<UpdateAutomation> = z.object({
  boardId: z.string().optional(),
  name: z.string().optional(),
  trigger: z.record(z.string(), z.any()).optional(),
  actions: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
