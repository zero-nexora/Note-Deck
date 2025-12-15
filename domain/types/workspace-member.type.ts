import { workspaceMembers } from "@/db/schema";

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type UpdateWorkspaceMember = Partial<NewWorkspaceMember>;
