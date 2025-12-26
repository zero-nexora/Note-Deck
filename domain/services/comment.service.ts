import { activityRepository } from "../repositories/activity.repository";
import { commentRepository } from "../repositories/comment.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const commentService = {
  create: async (userId: string, data: CreateCommentInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    if (data.parentId) {
      const parent = await commentRepository.findById(data.parentId);
      if (!parent) throw new Error("Parent comment not found");
      if (parent.cardId !== data.cardId) {
        throw new Error("Parent comment does not belong to this card");
      }
    }

    const comment = await commentRepository.create({
      ...data,
      userId,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.created",
      entityType: "comment",
      entityId: comment.id,
      metadata: { content: comment.content, parentId: data.parentId },
    });

    if (data.mentions && data.mentions.length > 0) {
      for (const mentionedUserId of data.mentions) {
        if (mentionedUserId === userId) continue;

        await notificationRepository.create({
          userId: mentionedUserId,
          type: "mention",
          title: "You were mentioned in a comment",
          message: "You were mentioned in a comment",
          entityType: "comment",
          entityId: comment.id,
        });
      }
    }

    return comment;
  },

  update: async (userId: string, id: string, data: UpdateCommentInput) => {
    const comment = await commentRepository.findById(id);
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await commentRepository.update(id, data);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.updated",
      entityType: "comment",
      entityId: comment.id,
      metadata: data,
    });

    if (data.mentions && data.mentions.length > 0) {
      for (const mentionedUserId of data.mentions) {
        await notificationRepository.create({
          userId: mentionedUserId,
          type: "mention",
          title: "You were mentioned",
          message: `You were mentioned in a comment on ${card.title}`,
          entityType: "comment",
          entityId: id,
        });
      }
    }

    return updated;
  },

  delete: async (userId: string, data: DeleteCommentInput) => {
    const comment = await commentRepository.findById(data.id);
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId) {
      const card = await cardRepository.findById(comment.cardId);
      if (!card) throw new Error("Card not found");

      const hasAdminPermission = await checkBoardPermission(
        userId,
        card.boardId,
        "admin"
      );
      if (!hasAdminPermission) {
        throw new Error("You can only delete your own comments");
      }
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) throw new Error("Card not found");

    await commentRepository.delete(data.id);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "comment.deleted",
      entityType: "comment",
      entityId: comment.id,
      metadata: { content: comment.content },
    });
  },
};
