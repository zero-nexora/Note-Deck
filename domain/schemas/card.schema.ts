import { z } from "zod";

export const CreateCardSchema = z.object({
  listId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().url().optional(),
});

export const UpdateCardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  coverImage: z.string().url().optional(),
});

export const MoveCardSchema = z.object({
  id: z.string().min(1),
  sourceListId: z.string().min(1),
  destinationListId: z.string().min(1),
  sourceOrders: z.array(
    z.object({
      id: z.string().min(1),
      position: z.number().int().min(0),
    })
  ),
  destinationOrders: z.array(
    z.object({
      id: z.string().min(1),
      position: z.number().int().min(0),
    })
  ).min(1),
});

export const ReorderCardsSchema = z.object({
  listId: z.string().min(1),
  orders: z.array(
    z.object({
      id: z.string().min(1),
      position: z.number().int().min(0),
    })
  ).min(1),
});

export const ArchiveCardSchema = z.object({
  id: z.string().min(1),
});

export const RestoreCardSchema = z.object({
  id: z.string().min(1),
});

export const DeleteCardSchema = z.object({
  id: z.string().min(1),
});

export type CreateCardInput = z.infer<typeof CreateCardSchema>;
export type UpdateCardInput = z.infer<typeof UpdateCardSchema>;
export type MoveCardInput = z.infer<typeof MoveCardSchema>;
export type ReorderCardsInput = z.infer<typeof ReorderCardsSchema>;
export type ArchiveCardInput = z.infer<typeof ArchiveCardSchema>;
export type RestoreCardInput = z.infer<typeof RestoreCardSchema>;
export type DeleteCardInput = z.infer<typeof DeleteCardSchema>;
