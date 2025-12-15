import { z } from "zod";
import {
  NewChecklistItem,
  UpdateChecklistItem,
} from "../types/check-list-item.type";

export const CreateChecklistItemSchema: z.ZodType<NewChecklistItem> = z.object({
  checklistId: z.string(),
  text: z.string(),
  isCompleted: z.boolean().optional(),
  position: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateChecklistItemSchema: z.ZodType<UpdateChecklistItem> =
  z.object({
    checklistId: z.string().optional(),
    text: z.string().optional(),
    isCompleted: z.boolean().optional(),
    position: z.number().optional(),
    updatedAt: z.date().optional(),
  });

export type CreateChecklistItemInput = z.infer<
  typeof CreateChecklistItemSchema
>;
export type UpdateChecklistItemInput = z.infer<
  typeof UpdateChecklistItemSchema
>;
