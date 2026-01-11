import { z } from "zod";

export const AddGroupMemberSchema = z.object({
  groupId: z.string().uuid({ message: "Invalid UUID for groupId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

export const RemoveGroupMemberSchema = z.object({
  groupId: z.string().uuid({ message: "Invalid UUID for groupId" }),
  userId: z.string().uuid({ message: "Invalid UUID for userId" }),
});

export type AddGroupMemberInput = z.infer<typeof AddGroupMemberSchema>;
export type RemoveGroupMemberInput = z.infer<typeof RemoveGroupMemberSchema>;
