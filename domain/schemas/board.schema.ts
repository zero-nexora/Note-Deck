import { z } from "zod";

export const CreateBoardSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateBoardSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const ArchiveBoardSchema = z.object({
  id: z.string().min(1),
});

export const RestoreBoardSchema = z.object({
  id: z.string().min(1),
});

export const DeleteBoardSchema = z.object({
  id: z.string().min(1),
});

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
export type ArchiveBoardInput = z.infer<typeof ArchiveBoardSchema>;
export type RestoreBoardInput = z.infer<typeof RestoreBoardSchema>;
export type DeleteBoardInput = z.infer<typeof DeleteBoardSchema>;
