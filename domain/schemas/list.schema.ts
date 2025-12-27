import { z } from "zod";

export const CreateListSchema = z.object({
  boardId: z.string().min(1),
  name: z.string().min(1),
});

export const UpdateListSchema = z.object({
  name: z.string().min(1).optional(),
});

export const MoveListSchema = z.object({
  id: z.string().min(1),
  boardId: z.string().min(1),
  position: z.number().int().min(0),
});

export const ArchiveListSchema = z.object({
  id: z.string().min(1),
});

export const RestoreListSchema = z.object({
  id: z.string().min(1),
});

export const DeleteListSchema = z.object({
  id: z.string().min(1),
});

export const ReorderListsSchema = z.object({
  boardId: z.string().min(1),
  orders: z.array(
    z.object({
      id: z.string().min(1),
      position: z.number().int().min(0),
    })
  ).min(1),
});

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
export type MoveListInput = z.infer<typeof MoveListSchema>;
export type ArchiveListInput = z.infer<typeof ArchiveListSchema>;
export type RestoreListInput = z.infer<typeof RestoreListSchema>;
export type DeleteListInput = z.infer<typeof DeleteListSchema>;
export type ReorderListsInput  = z.infer<typeof ReorderListsSchema>;