import { z } from "zod";

export const CreateBoardSchema = z.object({
  workspaceId: z.string().uuid({ message: "Invalid UUID for workspaceId" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});

export const UpdateBoardSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z.string().optional(),
});

export const DeleteBoardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ArchiveBoardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const RestoreBoardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const FindBoardByIdSchema = z.object({
  boardId: z.string().min(1, "Invalid UUID for board id"),
});

export const FindBoardsByWorkspaceIdSchema = z.object({
  workspaceId: z.string().min(1, "Invalid UUID for workspace id"),
});

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>;
export type DeleteBoardInput = z.infer<typeof DeleteBoardSchema>;
export type ArchiveBoardInput = z.infer<typeof ArchiveBoardSchema>;
export type RestoreBoardInput = z.infer<typeof RestoreBoardSchema>;
export type FindBoardByIdInput = z.infer<typeof FindBoardByIdSchema>;
export type FindBoardsByWorkspaceIdInput = z.infer<
  typeof FindBoardsByWorkspaceIdSchema
>;
