import { z } from "zod";

export const AddCardMemberSchema = z.object({
  cardId: z.string().min(1),
  userId: z.string().min(1),
});

export const RemoveCardMemberSchema = z.object({
  cardId: z.string().min(1),
  userId: z.string().min(1),
});

export type AddCardMemberInput = z.infer<typeof AddCardMemberSchema>;
export type RemoveCardMemberInput = z.infer<typeof RemoveCardMemberSchema>;
