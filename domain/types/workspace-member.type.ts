import { workspaceMembers } from "@/db/schema";
import { workspaceMemberService } from "../services/workspace-member.service";

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type UpdateWorkspaceMember = Partial<NewWorkspaceMember>;

export type WorkspaceMemberWithUser = Awaited<
  ReturnType<typeof workspaceMemberService.list>
>[number];
