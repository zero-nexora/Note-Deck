import { workspaceInvites } from "@/db/schema";

export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type NewWorkspaceInvite = typeof workspaceInvites.$inferInsert;
export type UpdateWorkspaceInvite = Partial<NewWorkspaceInvite>;
