import { attachmentRepository } from "../repositories/attachment.repository";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  checkBoardPermission,
  // checkUserGroupPermission,
} from "@/lib/check-permissions";
import {
  CreateAttachmentInput,
  DeleteAttachmentInput,
} from "../schemas/attachment.schema";
import {
  ACTIVITY_ACTION,
  ENTITY_TYPE,
  MAX_FILE_SIZE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const attachmentService = {
  create: async (userId: string, data: CreateAttachmentInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasWorkspaceRoleAccess = await checkBoardPermission(
      userId,
      card.boardId,
      ROLE.NORMAL
    );

    // const hasCardAddAttachmentPermission = await checkUserGroupPermission(
    //   userId,
    //   card.board.workspaceId,
    //   PERMISSIONS.CARD_ATTACHMENT
    // );

    // if (!hasWorkspaceRoleAccess || !hasCardAddAttachmentPermission) {
    //   throw new Error("Permission denied");
    // }

    if (!hasWorkspaceRoleAccess) {
      throw new Error("Permission denied");
    }

    const trimmedFileName = data.fileName.trim();
    if (!trimmedFileName) {
      throw new Error("File name cannot be empty");
    }

    if (data.fileSize <= 0) {
      throw new Error("File size must be greater than 0");
    }

    if (data.fileSize > MAX_FILE_SIZE) {
      throw new Error("File size cannot exceed 50MB");
    }

    const attachmentData = {
      ...data,
      fileName: trimmedFileName,
      userId,
    };

    const attachment = await attachmentRepository.create(attachmentData);

    if (!attachment) {
      throw new Error("Failed to create attachment");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.ATTACHMENT_UPLOADED,
      entityType: ENTITY_TYPE.ATTACHMENT,
      entityId: attachment.id,
      metadata: {
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        cardTitle: card.title,
      },
    });

    return attachment;
  },

  delete: async (userId: string, data: DeleteAttachmentInput) => {
    const attachment = await attachmentRepository.findById(data.id);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    const card = await cardRepository.findById(attachment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    if (attachment.userId !== userId) {
      const hasBoardRoleAccess = await checkBoardPermission(
        userId,
        card.boardId,
        ROLE.ADMIN
      );

      // const hasCardAttachmentPermission = await checkUserGroupPermission(
      //   userId,
      //   card.board.workspaceId,
      //   PERMISSIONS.CARD_ATTACHMENT
      // );

      // if (!hasBoardRoleAccess || !hasCardAttachmentPermission) {
      //   throw new Error("You can only delete your own attachments");
      // }

      if (!hasBoardRoleAccess) {
        throw new Error("You can only delete your own attachments");
      }
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.ATTACHMENT_DELETED,
      entityType: ENTITY_TYPE.ATTACHMENT,
      entityId: data.id,
      metadata: {
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        cardTitle: card.title,
        wasOwnAttachment: attachment.userId === userId,
      },
    });

    await attachmentRepository.delete(data.id);
  },
};
