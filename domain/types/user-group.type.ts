import { userGroups } from "@/db/schema";
import { userGroupService } from "../services/user-group.service";

export type UserGroup = typeof userGroups.$inferSelect;
export type NewUserGroup = typeof userGroups.$inferInsert;
export type UpdateUserGroup = Partial<NewUserGroup>;

export type UserGroupWithMembers = Awaited<
  ReturnType<typeof userGroupService.findByWorkspaceId>
>[number];
