import { checkBoardPermission } from "@/lib/check-permissions";
import { commentReactionRepository } from "../repositories/comment-reaction.repository";
import {
  AddCommentReactionInput,
  RemoveCommentReactionInput,
} from "../schemas/comment-reaction.schema";
import { commentRepository } from "../repositories/comment.repository";
import { cardRepository } from "../repositories/card.repository";
import { activityRepository } from "../repositories/activity.repository";

export const commentReactionService = {
  add: async (userId: string, data: AddCommentReactionInput) => {
    const comment = await commentRepository.findById(data.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedEmoji = data.emoji.trim();
    if (!trimmedEmoji) {
      throw new Error("Emoji cannot be empty");
    }

    const exists = await commentReactionRepository.findByCommentUserEmoji(
      data.commentId,
      userId,
      trimmedEmoji
    );
    if (exists) {
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
      action: "comment.reaction.added",
      entityType: "comment",
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

    const card = await cardRepository.findById(comment.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) {
      throw new Error("Permission denied");
    }

    const trimmedEmoji = data.emoji.trim();

    const exists = await commentReactionRepository.findByCommentUserEmoji(
      data.commentId,
      userId,
      trimmedEmoji
    );
    if (!exists) {
      throw new Error("Reaction not found");
    }

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "comment.reaction.removed",
      entityType: "comment",
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
