import { z } from "zod";

export const CreateBoardSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const UpdateBoardSchema = z.object({
  workspaceId: z.string(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  isArchived: z.boolean().optional(),
});

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
