import z from "zod";

export const AddCardMemberSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

export const RemoveCardMemberSchema = z.object({
  cardId: z.string().uuid({ message: "Invalid UUID for cardId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

export type AddCardMemberInput = z.infer<typeof AddCardMemberSchema>;
export type RemoveCardMemberInput = z.infer<typeof RemoveCardMemberSchema>;
