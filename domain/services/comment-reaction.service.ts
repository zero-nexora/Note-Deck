import { canUser } from "@/lib/check-permissions";
import { commentReactionRepository } from "../repositories/comment-reaction.repository";
import {
  AddCommentReactionInput,
  RemoveCommentReactionInput,
} from "../schemas/comment-reaction.schema";
import { commentRepository } from "../repositories/comment.repository";
import { cardRepository } from "../repositories/card.repository";
import { activityRepository } from "../repositories/activity.repository";
import { ACTIVITY_ACTION, ENTITY_TYPE, ROLE } from "@/lib/constants";

export const commentReactionService = {
  add: async (userId: string, data: AddCommentReactionInput) => {
    const comment = await commentRepository.findById(data.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const card = await cardRepository.findByIdWithBoard(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    const trimmedEmoji = data.emoji.trim();
    if (!trimmedEmoji) {
      throw new Error("Emoji cannot be empty");
    }

    const existingReaction =
      await commentReactionRepository.findByCommentIdUserEmoji(
        data.commentId,
        userId,
        trimmedEmoji
      );
    if (existingReaction) {
      throw new Error("You have already added this reaction");
    }

    const reaction = await commentReactionRepository.add({
      commentId: data.commentId,
      emoji: trimmedEmoji,
      userId,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.COMMENT_REACTION_ADDED,
      entityType: ENTITY_TYPE.COMMENT,
      entityId: data.commentId,
      metadata: { emoji: trimmedEmoji },
    });

    return reaction;
  },

  remove: async (userId: string, data: RemoveCommentReactionInput) => {
    const comment = await commentRepository.findById(data.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const card = await cardRepository.findByIdWithBoard(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const allowed = await canUser(userId, {
      workspaceId: card.board.workspaceId,
      boardId: card.boardId,
      boardRole: ROLE.OBSERVER,
    });
    if (!allowed) throw new Error("Permission denied");

    const trimmedEmoji = data.emoji.trim();

    const existingReaction =
      await commentReactionRepository.findByCommentIdUserEmoji(
        data.commentId,
        userId,
        trimmedEmoji
      );
    if (!existingReaction) {
      throw new Error("Reaction not found");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: ACTIVITY_ACTION.COMMENT_REACTION_REMOVED,
      entityType: ENTITY_TYPE.COMMENT,
      entityId: data.commentId,
      metadata: { emoji: trimmedEmoji },
    });

    await commentReactionRepository.remove(
      data.commentId,
      userId,
      trimmedEmoji
    );
  },
};
