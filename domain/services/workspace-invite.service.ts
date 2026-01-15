import { workspaceInviteRepository } from "../repositories/workspace-invite.repository";
import { workspaceMemberRepository } from "../repositories/workspace-member.repository";
import { workspaceRepository } from "../repositories/workspace.repository";
import { userRepository } from "../repositories/user.repository";
import { checkWorkspacePermission } from "@/lib/check-permissions";
import {
  CreateInviteInput,
  ResendInviteInput,
  RevokeInviteInput,
  AcceptInviteInput,
  ExpireInviteInput,
  ListPendingInvitesInput,
} from "../schemas/workspace-invite.schema";
import crypto from "crypto";
import { auditLogRepository } from "../repositories/audit-log.repository";
import { sendWorkspaceInviteEmail } from "@/lib/email";
import {
  AUDIT_ACTION,
  DEFAULT_WORKSPACE_MEMBER_ROLE,
  ENTITY_TYPE,
  ROLE,
} from "@/lib/constants";

export const workspaceInviteService = {
  create: async (userId: string, data: CreateInviteInput) => {
    const workspace = await workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const normalizedEmail = data.email.toLowerCase().trim();

    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const existingMember =
        await workspaceMemberRepository.findByWorkspaceIdAndUserId(
          data.workspaceId,
          existingUser.id
        );
      if (existingMember) {
        throw new Error("User is already a member");
      }
    }

    const existingInvite =
      await workspaceInviteRepository.findByWorkspaceIdAndEmail(
        data.workspaceId,
        normalizedEmail
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

    const role = data.role || DEFAULT_WORKSPACE_MEMBER_ROLE;

    const invite = await workspaceInviteRepository.create({
      workspaceId: data.workspaceId,
      email: normalizedEmail,
      role,
      token,
      expiresAt,
    });

    await sendWorkspaceInviteEmail(normalizedEmail, workspace.name, token);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_INVITE_CREATED,
      entityType: ENTITY_TYPE.WORKSPACE_INVITE,
      entityId: invite.id,
      metadata: {
        email: normalizedEmail,
        role,
        expiresAt: expiresAt.toISOString(),
      },
    });

    return invite;
  },

  listPendingInvites: async (userId: string, data: ListPendingInvitesInput) => {
    const hasPermission = await checkWorkspacePermission(
      userId,
      data.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const invites = await workspaceInviteRepository.findByWorkspaceId(
      data.workspaceId,
      true
    );

    return invites;
  },

  resend: async (userId: string, data: ResendInviteInput) => {
    const invite = await workspaceInviteRepository.findById(data.id);
    if (!invite) {
      throw new Error("Invite not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      invite.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    const workspace = await workspaceRepository.findById(invite.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updatedInvite = await workspaceInviteRepository.updateExpiry(
      data.id,
      expiresAt
    );

    await sendWorkspaceInviteEmail(invite.email, workspace.name, invite.token);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_INVITE_RESENT,
      entityType: ENTITY_TYPE.WORKSPACE_INVITE,
      entityId: data.id,
      metadata: {
        email: invite.email,
        newExpiresAt: expiresAt.toISOString(),
      },
    });

    return updatedInvite;
  },

  revoke: async (userId: string, data: RevokeInviteInput) => {
    const invite = await workspaceInviteRepository.findByToken(data.token);
    if (!invite) {
      throw new Error("Invalid invite token");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      invite.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (invite.acceptedAt) {
      throw new Error("Invite already accepted");
    }

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_INVITE_REVOKED,
      entityType: ENTITY_TYPE.WORKSPACE_INVITE,
      entityId: invite.id,
      metadata: {
        email: invite.email,
        role: invite.role,
      },
    });

    await workspaceInviteRepository.revoke(invite.id);
  },

  accept: async (userId: string, data: AcceptInviteInput) => {
    const invite = await workspaceInviteRepository.findByToken(data.token);
    if (!invite) {
      throw new Error("Invalid invite token");
    }

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    const now = new Date();
    if (invite.expiresAt < now) {
      throw new Error("Invite has expired");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const normalizedUserEmail = user.email?.toLowerCase().trim();
    const normalizedInviteEmail = invite.email.toLowerCase().trim();

    if (normalizedUserEmail !== normalizedInviteEmail) {
      throw new Error("This invite is for a different email address");
    }

    const existingMember =
      await workspaceMemberRepository.findByWorkspaceIdAndUserId(
        invite.workspaceId,
        userId
      );
    if (existingMember) {
      throw new Error("You are already a member of this workspace");
    }

    await workspaceMemberRepository.add({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role,
    });

    await workspaceInviteRepository.accept(invite.id);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_INVITE_ACCEPTED,
      entityType: ENTITY_TYPE.WORKSPACE_INVITE,
      entityId: invite.id,
      metadata: {
        email: invite.email,
        role: invite.role,
      },
    });

    return invite;
  },

  expire: async (userId: string, data: ExpireInviteInput) => {
    const invite = await workspaceInviteRepository.findById(data.id);
    if (!invite) {
      throw new Error("Invite not found");
    }

    const hasPermission = await checkWorkspacePermission(
      userId,
      invite.workspaceId,
      ROLE.ADMIN
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    if (invite.acceptedAt) {
      throw new Error("Invite has already been accepted");
    }

    const now = new Date();

    if (invite.expiresAt <= now) {
      return invite;
    }

    await workspaceInviteRepository.updateExpiry(data.id, now);

    await auditLogRepository.create({
      workspaceId: invite.workspaceId,
      userId,
      action: AUDIT_ACTION.WORKSPACE_INVITE_EXPIRED,
      entityType: ENTITY_TYPE.WORKSPACE_INVITE,
      entityId: data.id,
      metadata: {
        email: invite.email,
        oldExpiresAt: invite.expiresAt.toISOString(),
        newExpiresAt: now.toISOString(),
      },
    });

    return { ...invite, expiresAt: now };
  },
};
