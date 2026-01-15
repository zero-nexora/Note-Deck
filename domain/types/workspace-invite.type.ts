import { workspaceInvites } from "@/db/schema";
import { workspaceInviteService } from "../services/workspace-invite.service";

export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type NewWorkspaceInvite = typeof workspaceInvites.$inferInsert;
export type UpdateWorkspaceInvite = Partial<NewWorkspaceInvite>;

export type workspacePendingInvite = Awaited<
  ReturnType<typeof workspaceInviteService.listPendingInvites>
>[number];
