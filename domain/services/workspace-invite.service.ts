import { workspaceInviteRepository } from "../repositories/workspace-invite.repository";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { userRepository } from "../repositories/user.repository";
import { checkWorkspacePermission } from "@/lib/permissions";
import {
  CreateInviteInput,
  ResendInviteInput,
  RevokeInviteInput,
  AcceptInviteInput,
  ExpireInviteInput,
} from "../schemas/workspace-invite.schema";
import crypto from "crypto";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { sendWorkspaceInviteEmail } from "@/lib/email";

export const workspaceInviteService = {
  create: async (userId: string, data: CreateInviteInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const existingMember =
        await workspaceMemberRepository.findByWorkspaceIdAndUserId(
          data.workspaceId,
          existingUser.id
        );
      if (existingMember) throw new Error("User is already a member");
    }

    const existingInvite =
      await workspaceInviteRepository.findByWorkspaceIdAndEmail(
        data.workspaceId,
        data.email
      );
    if (existingInvite && !existingInvite.acceptedAt) {
      const now = new Date();
      if (existingInvite.expiresAt > now) {
        throw new Error("An active invite already exists for this email");
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays || 7));

    const invite = await workspaceInviteRepository.create({
      workspaceId: data.workspaceId,
      email: data.email,
      role: data.role || "normal",
      token,
      expiresAt,
    });

    sendWorkspaceInviteEmail(data.email, workspace.name, token);

    await auditLogRepository.create({
      workspaceId: data.workspaceId,
      userId,
      action: "workspace_invite.created",
      entityType: "workspace_invite",
      entityId: invite.id,
      metadata: { email: data.email, role: data.role },
    });

    return invite;
  },

  resend: async (userId: string, data: ResendInviteInput) => {
    const invite = await workspaceInviteRepository.findById(data.id);
    if (!invite) throw new Error("Invite not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      invite.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updated = await workspaceInviteRepository.updateExpiry(
      data.id,
      expiresAt
    );

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: "workspace_invite.resent",
      entityType: "workspace_invite",
      entityId: data.id,
      metadata: { email: invite.email },
    });

    return updated;
  },

  revoke: async (userId: string, data: RevokeInviteInput) => {
    const invite = await workspaceInviteRepository.findByToken(data.token);
    if (!invite) throw new Error("Invalid invite token");

    if (invite.acceptedAt) {
      throw new Error("Invite already accepted");
    }

    await workspaceInviteRepository.revoke(invite.id);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: "workspace_invite.revoked_by_email",
      entityType: "workspace_invite",
      entityId: invite.id,
      metadata: { email: invite.email },
    });
  },

  accept: async (userId: string, data: AcceptInviteInput) => {
    const invite = await workspaceInviteRepository.findByToken(data.token);
    if (!invite) throw new Error("Invalid invite token");

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    const now = new Date();
    if (invite.expiresAt < now) {
      throw new Error("Invite has expired");
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.email !== invite.email) {
      throw new Error("This invite is for a different email address");
    }

    const existingMember =
      await workspaceMemberRepository.findByWorkspaceIdAndUserId(
        invite.workspaceId,
        userId
      );
    if (existingMember) throw new Error("You are already a member");

    await workspaceMemberRepository.add({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role,
    });

    await workspaceInviteRepository.accept(invite.id);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: "workspace_invite.accepted",
      entityType: "workspace_invite",
      entityId: invite.id,
      metadata: { email: invite.email },
    });

    return invite;
  },

  expire: async (userId: string, data: ExpireInviteInput) => {
    const invite = await workspaceInviteRepository.findById(data.id);
    if (!invite) throw new Error("Invite not found");

    const hasPermission = await checkWorkspacePermission(
      userId,
      invite.workspaceId,
      "admin"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const now = new Date();
    await workspaceInviteRepository.updateExpiry(data.id, now);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: "workspace_invite.expired",
      entityType: "workspace_invite",
      entityId: data.id,
      metadata: { email: invite.email },
    });
  },
};
