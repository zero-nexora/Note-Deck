import { z } from "zod";
import { NewList, UpdateList } from "../types/list.type";

export const CreateListSchema: z.ZodType<NewList> = z.object({
  boardId: z.string(),
  name: z.string(),
  position: z.number(),
  isArchived: z.boolean().optional(),
  createdAt: z.date().optional(),
});

export const UpdateListSchema: z.ZodType<UpdateList> = z.object({
  boardId: z.string().optional(),
  name: z.string().optional(),
  position: z.number().optional(),
  isArchived: z.boolean().optional(),
  updatedAt: z.date().optional(),
});

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
