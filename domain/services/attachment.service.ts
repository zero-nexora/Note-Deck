import { activityRepository } from "../repositories/activity.repository";
import { attachmentRepository } from "../repositories/attachment.repository";
import { CreateAttachmentInput } from "../schemas/attachment.schema";

export const attachmentService = {
  create: async (
    userId: string,
    boardId: string,
    data: CreateAttachmentInput
  ) => {
    const attachment = await attachmentRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: data.cardId,
      userId,
      action: "attachment.added",
      entityType: "attachment",
      entityId: attachment.id,
      metadata: { fileName: data.fileName },
    });

    return attachment;
  },

  delete: async (
    userId: string,
    boardId: string,
    cardId: string,
    attachmentId: string
  ) => {
    await attachmentRepository.delete(attachmentId);

    await activityRepository.create({
      boardId,
      cardId,
      userId,
      action: "attachment.deleted",
      entityType: "attachment",
      entityId: attachmentId,
      metadata: {},
    });
  },
};
