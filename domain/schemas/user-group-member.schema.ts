import { z } from "zod";

export const CreateUserGroupMemberSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
});

export type CreateUserGroupMemberInput = z.infer<
  typeof CreateUserGroupMemberSchema
>;
