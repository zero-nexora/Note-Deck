import { attachmentRepository } from "../repositories/attachment.repository";
import { activityRepository } from "../repositories/activity.repository";
import { cardRepository } from "../repositories/card.repository";
import { checkBoardPermission } from "@/lib/check-permissions";
import {
  CreateAttachmentInput,
  DeleteAttachmentInput,
} from "../schemas/attachment.schema";

export const attachmentService = {
  create: async (userId: string, data: CreateAttachmentInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const attachment = await attachmentRepository.create({
      ...data,
      userId,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "attachment.uploaded",
      entityType: "attachment",
      entityId: attachment.id,
      metadata: {
        fileName: attachment.fileName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
      },
    });

    return attachment;
  },

  delete: async (userId: string, data: DeleteAttachmentInput) => {
    const attachment = await attachmentRepository.findById(data.id);
    if (!attachment) throw new Error("Attachment not found");

    const card = await cardRepository.findById(attachment.cardId);
    if (!card) throw new Error("Card not found");

    if (attachment.userId !== userId) {
      const hasAdminPermission = await checkBoardPermission(
        userId,
        card.boardId,
        "admin"
      );
      if (!hasAdminPermission) {
        throw new Error("You can only delete your own attachments");
      }
    }

    await attachmentRepository.delete(data.id);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "attachment.deleted",
      entityType: "attachment",
      entityId: data.id,
      metadata: { fileName: attachment.fileName },
    });
  },
};
