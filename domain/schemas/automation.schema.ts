import { z } from "zod";

export const CreateAutomationSchema = z.object({
  boardId: z.string(),
  name: z.string(),
  trigger: z.record(z.string(), z.any()),
  actions: z.record(z.string(), z.any()),
});

export const UpdateAutomationSchema = z.object({
  boardId: z.string().optional(),
  name: z.string().optional(),
  trigger: z.record(z.string(), z.any()).optional(),
  actions: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateAutomationInput = z.infer<typeof CreateAutomationSchema>;
export type UpdateAutomationInput = z.infer<typeof UpdateAutomationSchema>;
