import { commentReactionRepository } from "../repositories/comment-reaction.repository";
import { CreateCommentReactionInput } from "../schemas/comment-reaction.schema";

export const commentReactionService = {
  add: async (data: CreateCommentReactionInput) => {
    return commentReactionRepository.add(data);
  },

  remove: async (commentId: string, userId: string, emoji: string) => {
    return commentReactionRepository.remove(commentId, userId, emoji);
  },
};
