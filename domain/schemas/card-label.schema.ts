import { z } from "zod";

export const CreateCardLabelSchema = z.object({
  cardId: z.string(),
  labelId: z.string(),
});

export type CreateCardLabelInput = z.infer<typeof CreateCardLabelSchema>;
