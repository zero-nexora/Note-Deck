import { z } from "zod";
import { NewCardLabel } from "../types/card-label.type";

export const CreateCardLabelSchema: z.ZodType<NewCardLabel> = z.object({
  cardId: z.string(),
  labelId: z.string(),
  createdAt: z.date().optional(),
});

export type CreateCardLabelInput = z.infer<typeof CreateCardLabelSchema>;
