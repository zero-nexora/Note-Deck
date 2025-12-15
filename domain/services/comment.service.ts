import { activityRepository } from "../repositories/activity.repository";
import { commentRepository } from "../repositories/comment.repository";
import { notificationRepository } from "../repositories/notification.repository";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";

export const commentService = {
  create: async (userId: string, boardId: string, data: CreateCommentInput) => {
    const comment = await commentRepository.create(data);

    await activityRepository.create({
      boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.created",
      entityType: "comment",
      entityId: comment.id,
      metadata: { content: comment.content },
    });

    if (
      data.mentions &&
      Array.isArray(data.mentions) &&
      data.mentions.length > 0
    ) {
      for (const mentionedUserId of data.mentions) {
        await notificationRepository.create({
          userId: mentionedUserId,
          type: "mention",
          title: "You were mentioned in a comment",
          message: `You were mentioned in a comment`,
          entityType: "comment",
          entityId: comment.id,
        });
      }
    }

    return comment;
  },

  update: async (userId: string, data: UpdateCommentInput) => {
    const updated = await commentRepository.update(data);

    return updated;
  },

  delete: async (userId: string, commentId: string) => {
    return await commentRepository.delete(commentId);
  },
};
