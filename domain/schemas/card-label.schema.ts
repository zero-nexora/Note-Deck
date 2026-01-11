import z from "zod";

export const AddCardLabelSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  labelId: z.string().uuid({ message: "Invalid UUID for labelId" }),
});

export const RemoveCardLabelSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  labelId: z.string().uuid({ message: "Invalid UUID for labelId" }),
});

export type AddCardLabelInput = z.infer<typeof AddCardLabelSchema>;
export type RemoveCardLabelInput = z.infer<typeof RemoveCardLabelSchema>;
