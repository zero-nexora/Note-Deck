import { activityRepository } from "../repositories/activity.repository";
import { commentRepository } from "../repositories/comment.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { checkBoardPermission } from "@/lib/permissions";

export const commentService = {
  create: async (userId: string, boardId: string, data: CreateCommentInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) throw new Error("Card not found");

    if (card.boardId !== boardId)
      throw new Error("Card does not belong to board");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

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

    if (data.mentions?.length) {
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

  findById: async (userId: string, id: string) => {
    const comment = await commentRepository.findById(id);
    if (!comment) throw new Error("Comment not found");

    return comment;
  },

  findByCardId: async (userId: string, cardId: string) => {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    return await commentRepository.findByCardId(cardId);
  },

  update: async (
    userId: string,
    boardId: string,
    id: string,
    data: UpdateCommentInput
  ) => {
    const comment = await commentRepository.findById(id);
    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== userId) throw new Error("Permission denied");

    const hasPermission = await checkBoardPermission(userId, boardId, "normal");
    if (!hasPermission) throw new Error("Permission denied");

    const updated = await commentRepository.update(id, data);

    await activityRepository.create({
      boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.updated",
      entityType: "comment",
      entityId: comment.id,
      metadata: data,
    });

    return updated;
  },

  delete: async (userId: string, boardId: string, id: string) => {
    const comment = await commentRepository.findById(id);
    if (!comment) throw new Error("Comment not found");

    const hasPermission = await checkBoardPermission(userId, boardId, "admin");

    if (!hasPermission && comment.userId !== userId)
      throw new Error("Permission denied");

    await commentRepository.delete(id);

    await activityRepository.create({
      boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.deleted",
      entityType: "comment",
      entityId: comment.id,
      metadata: { content: comment.content },
    });
  },
};
