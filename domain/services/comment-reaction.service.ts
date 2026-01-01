import { checkBoardPermission } from "@/lib/check-permissions";
import { cardRepository } from "../repositories/card.repository";
import { commentReactionRepository } from "../repositories/comment-reaction.repository";
import { commentRepository } from "../repositories/comment.repository";
import {
  AddCommentReactionInput,
  RemoveCommentReactionInput,
} from "../schemas/comment-reaction.schema";
import { activityRepository } from "../repositories/activity.repository";

export const commentReactionService = {
  add: async (userId: string, data: AddCommentReactionInput) => {
    const comment = await commentRepository.findById(data.commentId);
    if (!comment) throw new Error("Comment not found");

    const card = await cardRepository.findById(comment.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await commentReactionRepository.findByCommentUserEmoji(
      data.commentId,
      userId,
      data.emoji
    );
    if (exists) throw new Error("Reaction already added");

    const reaction = await commentReactionRepository.add({
      ...data,
      userId,
    });

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "comment.reaction.added",
      entityType: "comment",
      entityId: data.commentId,
      metadata: { emoji: data.emoji },
    });

    return reaction;
  },

  remove: async (userId: string, data: RemoveCommentReactionInput) => {
    const comment = await commentRepository.findById(data.commentId);
    if (!comment) throw new Error("Comment not found");

    const card = await cardRepository.findById(comment.cardId);
    if (!card) throw new Error("Card not found");

    const hasPermission = await checkBoardPermission(
      userId,
      card.boardId,
      "observer"
    );
    if (!hasPermission) throw new Error("Permission denied");

    const exists = await commentReactionRepository.findByCommentUserEmoji(
      data.commentId,
      userId,
      data.emoji
    );
    if (!exists) throw new Error("Reaction not found");

    await commentReactionRepository.remove(data.commentId, userId, data.emoji);

    await activityRepository.create({
      boardId: card.boardId,
      cardId: card.id,
      userId,
      action: "comment.reaction_removed",
      entityType: "comment",
      entityId: data.commentId,
      metadata: { emoji: data.emoji },
    });
  },
};
