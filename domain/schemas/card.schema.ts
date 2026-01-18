import z from "zod";

export const CreateCardSchema = z.object({
  listId: z.string().uuid({ message: "Invalid UUID for listId" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().optional(),
});

export const UpdateCardSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().optional(),
});

export const DeleteCardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const ArchiveCardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const RestoreCardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const DuplicateCardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
});

export const MoveCardSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID for id" }),
  sourceListId: z.string().uuid({ message: "Invalid UUID for sourceListId" }),
  destinationListId: z
    .string()
    .uuid({ message: "Invalid UUID for destinationListId" }),
  sourceOrders: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid UUID for id" }),
      position: z.number().int(),
    }),
  ),
  destinationOrders: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid UUID for id" }),
      position: z.number().int(),
    }),
  ),
});

export const ReorderCardsSchema = z.object({
  listId: z.string().uuid({ message: "Invalid UUID for listId" }),
  orders: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid UUID for id" }),
      position: z.number().int(),
    }),
  ),
});

export const FindLimitCardByBoardIdSchema = z.object({
  boardId: z.string().min(1, "Board id is required"),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
export type DeleteCardInput = z.infer<typeof DeleteCardSchema>;
export type ArchiveCardInput = z.infer<typeof ArchiveCardSchema>;
export type RestoreCardInput = z.infer<typeof RestoreCardSchema>;
export type DuplicateCardInput = z.infer<typeof DuplicateCardSchema>;
export type MoveCardInput = z.infer<typeof MoveCardSchema>;
export type ReorderCardsInput = z.infer<typeof ReorderCardsSchema>;
export type FindLimitCardByBoardIdInput = z.infer<
  typeof FindLimitCardByBoardIdSchema
>;
