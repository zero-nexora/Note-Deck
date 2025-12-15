import { userGroups } from "@/db/schema";

export type UserGroup = typeof userGroups.$inferSelect;
export type NewUserGroup = typeof userGroups.$inferInsert;
export type UpdateUserGroup = Partial<NewUserGroup>;