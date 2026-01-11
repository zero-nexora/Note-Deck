import z from "zod";

export const CreateListSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  name: z.string().min(1, { message: "Name is required" }),
});

export const UpdateListSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
});

export const DeleteListSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ArchiveListSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const RestoreListSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const DuplicateListSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ReorderListsSchema = z.object({
  boardId: z.string().uuid({ message: "Invalid UUID for boardId" }),
  orders: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid UUID for id" }),
      position: z.number().int(),
    })
  ),
});

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
export type DeleteListInput = z.infer<typeof DeleteListSchema>;
export type ArchiveListInput = z.infer<typeof ArchiveListSchema>;
export type RestoreListInput = z.infer<typeof RestoreListSchema>;
export type DuplicateListInput = z.infer<typeof DuplicateListSchema>;
export type ReorderListsInput = z.infer<typeof ReorderListsSchema>;
