import { z } from "zod";

export const CreateCardMemberSchema = z.object({
  cardId: z.string(),
  userId: z.string(),
});

export type CreateCardMemberInput = z.infer<typeof CreateCardMemberSchema>;
