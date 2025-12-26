import { z } from "zod";

export const AddCardLabelSchema = z.object({
  cardId: z.string().min(1),
  labelId: z.string().min(1),
});

export const RemoveCardLabelSchema = z.object({
  cardId: z.string().min(1),
  labelId: z.string().min(1),
});

export type AddCardLabelInput = z.infer<typeof AddCardLabelSchema>;
export type RemoveCardLabelInput = z.infer<typeof RemoveCardLabelSchema>;
