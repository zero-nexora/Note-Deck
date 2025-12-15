import { z } from "zod";
import { NewUserGroupMember } from "../types/user-group-member.type";

export const CreateUserGroupMemberSchema: z.ZodType<NewUserGroupMember> =
  z.object({
    groupId: z.string(),
    userId: z.string(),
  });

export type CreateUserGroupMemberInput = z.infer<
  typeof CreateUserGroupMemberSchema
>;
