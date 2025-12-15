import { z } from "zod";
import { NewCardMember } from "../types/card-member.type";

export const CreateCardMemberSchema: z.ZodType<NewCardMember> = z.object({
  cardId: z.string(),
  userId: z.string(),
  createdAt: z.date().optional(),
});

export type CreateCardMemberInput = z.infer<typeof CreateCardMemberSchema>;
