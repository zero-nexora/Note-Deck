import { activityRepository } from "../repositories/activity.repository";
import { commentRepository } from "../repositories/comment.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { cardRepository } from "../repositories/card.repository";
import {
  CreateCommentInput,
  DeleteCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { canUser } from "@/lib/check-permissions";
import {
  ACTIVITY_ACTION,
  ENTITY_TYPE,
  NOTIFICATION_TYPE,
  PERMISSIONS,
  ROLE,
} from "@/lib/constants";

export const commentService = {
  create: async (userId: string, data: CreateCommentInput) => {
    const card = await cardRepository.findByIdWithBoard(data.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.NORMAL,
      permission: PERMISSIONS.COMMENT_CREATE,
    });
    if (!allowed) throw new Error("Permission denied");

    const trimmedContent = data.content.trim();
    if (!trimmedContent) {
      throw new Error("Comment content cannot be empty");
    }

    if (data.parentId) {
      const parentComment = await commentRepository.findById(data.parentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      if (parentComment.cardId !== data.cardId) {
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
      action: ACTIVITY_ACTION.COMMENT_CREATED,
      entityType: ENTITY_TYPE.COMMENT,
      entityId: comment.id,
      metadata: {
        content: comment.content.substring(0, 100),
        parentId: data.parentId,
        hasParent: !!data.parentId,
      },
    });

    if (data.mentions && data.mentions.length > 0) {
      const uniqueMentions = [...new Set(data.mentions)];

      for (const mentionedUserId of uniqueMentions) {
        if (mentionedUserId === userId) continue;

        await notificationRepository.create({
          userId: mentionedUserId,
          type: NOTIFICATION_TYPE.MENTION,
          title: "You were mentioned in a comment",
          message: `You were mentioned in a comment on "${card.title}"`,
          entityType: ENTITY_TYPE.COMMENT,
          entityId: comment.id,
        });
      }
    }

    return comment;
  },

  update: async (
    userId: string,
    commentId: string,
    data: UpdateCommentInput
  ) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("You can only edit your own comments");
    }

    const card = await cardRepository.findByIdWithBoard(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.ADMIN,
      permission: PERMISSIONS.COMMENT_UPDATE,
    });
    if (!allowed) throw new Error("Permission denied");

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

    const updatedComment = await commentRepository.update(
      commentId,
      updateData
    );

    const metadata: Record<string, any> = {};
    if (data.content !== undefined) {
      metadata.oldContent = comment.content.substring(0, 100);
      metadata.newContent = updateData.content?.substring(0, 100);
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: comment.cardId,
      userId,
      action: ACTIVITY_ACTION.COMMENT_UPDATED,
      entityType: ENTITY_TYPE.COMMENT,
      entityId: comment.id,
      metadata,
    });

    if (data.mentions && data.mentions.length > 0) {
      const uniqueMentions = [...new Set(data.mentions)];
      const oldMentions = new Set((comment.mentions as string[]) || []);
      const newMentions = uniqueMentions.filter(
        (mentionedUserId) => !oldMentions.has(mentionedUserId)
      );

      for (const mentionedUserId of newMentions) {
        if (mentionedUserId === userId) continue;

        await notificationRepository.create({
          userId: mentionedUserId,
          type: NOTIFICATION_TYPE.MENTION,
          title: "You were mentioned",
          message: `You were mentioned in a comment on "${card.title}"`,
          entityType: ENTITY_TYPE.COMMENT,
          entityId: commentId,
        });
      }
    }

    return updatedComment;
  },

  delete: async (userId: string, data: DeleteCommentInput) => {
    const comment = await commentRepository.findById(data.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const card = await cardRepository.findByIdWithBoard(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    if (comment.userId !== userId) {
      const allowed = await canUser(userId, {
        workspaceId: card.board.workspaceId,
        boardId: card.boardId,
        boardRole: ROLE.ADMIN,
        permission: PERMISSIONS.COMMENT_DELETE,
      });
      if (!allowed) throw new Error("Permission denied");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.COMMENT_DELETED,
      entityType: ENTITY_TYPE.COMMENT,
      entityId: comment.id,
      metadata: {
        content: comment.content.substring(0, 100),
        wasOwnComment: comment.userId === userId,
      },
    });

    await commentRepository.delete(data.id);
  },
};
