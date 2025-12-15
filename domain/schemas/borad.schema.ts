import { z } from "zod";
import { NewBoard, UpdateBoard } from "../types/board.type";

export const CreateBoardSchema: z.ZodType<NewBoard> = z.object({
  workspaceId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  background: z.string().nullable().optional(),
  isArchived: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const UpdateBoardSchema: z.ZodType<UpdateBoard> = z.object({
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  background: z.string().nullable().optional(),
  isArchived: z.boolean().optional(),
  updatedAt: z.date().optional(),
});

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
