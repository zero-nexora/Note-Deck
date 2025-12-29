import { workspaces } from "@/db/schema";
import { workspaceService } from "../services/workspace.service";

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type UpdateWorkspace = Partial<NewWorkspace>;

export type WorkspaceWithMember = Awaited<ReturnType<typeof workspaceService.findByUserId>>[number]
export type WorkspaceWithOwnerMembers = Awaited<ReturnType<typeof workspaceService.findById>>