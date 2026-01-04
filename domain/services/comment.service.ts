import { activityRepository } from "../repositories/activity.repository";
import { commentRepository } from "../repositories/comment.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { checkBoardPermission } from "@/lib/check-permissions";
import { executeAutomations } from "./automation.service";

export const commentService = {
  create: async (userId: string, data: CreateCommentInput) => {
    const card = await cardRepository.findById(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedContent = data.content.trim();
    if (!trimmedContent) {
      throw new Error("Comment content cannot be empty");
    }

    if (data.parentId) {
      const parent = await commentRepository.findById(data.parentId);
      if (!parent) {
        throw new Error("Parent comment not found");
      }
      if (parent.cardId !== data.cardId) {
        throw new Error("Parent comment does not belong to this card");
      }
    }

    const comment = await commentRepository.create({
      ...data,
      content: trimmedContent,
      userId,
    });

    if (!comment) {
      throw new Error("Failed to create comment");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.created",
      entityType: "comment",
      entityId: comment.id,
      metadata: {
        content: comment.content.substring(0, 100),
        parentId: data.parentId,
        hasParent: !!data.parentId,
      },
    });

    await executeAutomations({
      type: "COMMENT_ADDED",
      boardId: card.boardId,
      cardId: card.id,
      commentId: comment.id,
      userId,
    });

    if (data.mentions && data.mentions.length > 0) {
      const uniqueMentions = [...new Set(data.mentions)];

      for (const mentionedUserId of uniqueMentions) {
        if (mentionedUserId === userId) continue;

        await notificationRepository.create({
          userId: mentionedUserId,
          type: "mention",
          title: "You were mentioned in a comment",
          message: `You were mentioned in a comment on "${card.title}"`,
          entityType: "comment",
          entityId: comment.id,
        });

        await executeAutomations({
          type: "USER_MENTIONED",
          boardId: card.boardId,
          cardId: card.id,
          userId: mentionedUserId,
        });
      }
    }

    return comment;
  },

  update: async (userId: string, id: string, data: UpdateCommentInput) => {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "normal"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const updateData = { ...data };

    if (data.content !== undefined) {
      const trimmedContent = data.content.trim();
      if (!trimmedContent) {
        throw new Error("Comment content cannot be empty");
      }
      updateData.content = trimmedContent;

      if (comment.content === trimmedContent && !data.mentions) {
        return comment;
      }
    }

    const updated = await commentRepository.update(id, updateData);

    const metadata: Record<string, any> = {};
    if (data.content !== undefined) {
      metadata.oldContent = comment.content.substring(0, 100);
      metadata.newContent = updateData.content?.substring(0, 100);
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: comment.cardId,
      userId,
      action: "comment.updated",
      entityType: "comment",
      entityId: comment.id,
      metadata,
    });

    if (data.mentions && data.mentions.length > 0) {
      const uniqueMentions = [...new Set(data.mentions)];
      const oldMentions = new Set((comment.mentions as string[]) || []);
      const newMentions = uniqueMentions.filter((uid) => !oldMentions.has(uid));

      for (const mentionedUserId of newMentions) {
        if (mentionedUserId === userId) continue;

        await notificationRepository.create({
          userId: mentionedUserId,
          type: "mention",
          title: "You were mentioned",
          message: `You were mentioned in a comment on "${card.title}"`,
          entityType: "comment",
          entityId: id,
        });
      }
    }

    return updated;
  },

  delete: async (userId: string, data: DeleteCommentInput) => {
    const comment = await commentRepository.findById(data.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    if (comment.userId !== userId) {
      const hasAdminPermission = await checkBoardPermission(
        userId,
        card.boardId,
        "admin"
      );
      if (!hasAdminPermission) {
        throw new Error("You can only delete your own comments");
      }
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "comment.deleted",
      entityType: "comment",
      entityId: comment.id,
      metadata: {
        content: comment.content.substring(0, 100),
        wasOwnComment: comment.userId === userId,
      },
    });

    await commentRepository.delete(data.id);
  },
};
