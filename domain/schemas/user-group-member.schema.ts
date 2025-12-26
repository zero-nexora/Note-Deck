import { z } from "zod";

export const AddGroupMemberSchema = z.object({
  groupId: z.string().min(1),
  userId: z.string().min(1),
});

export const RemoveGroupMemberSchema = z.object({
  groupId: z.string().min(1),
  userId: z.string().min(1),
});

export type AddGroupMemberInput = z.infer<typeof AddGroupMemberSchema>;
export type RemoveGroupMemberInput = z.infer<typeof RemoveGroupMemberSchema>;
