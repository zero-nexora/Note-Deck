// import { User } from "@/domain/types/user.type";
// import { useCallback, useState } from "react";
// import {
//   useBroadcastEvent,
//   useEventListener,
//   RoomEvent,
// } from "@/lib/liveblocks";

// type CommentState = {
//   id: string;
//   cardId: string;
//   content?: string;
//   user: any;
//   reactions: any[];
//   replies: any[];
// };

// interface UseBoardRealtimeCommentsProps {
//   user: User;
// }

// export const useBoardRealtimeComments = ({
//   user,
// }: UseBoardRealtimeCommentsProps) => {
//   const broadcast = useBroadcastEvent();
//   const [newComments, setNewComments] = useState<Map<string, CommentState>>(
//     new Map(),
//   );
//   const [deletedCommentIds, setDeletedCommentIds] = useState<Set<string>>(
//     new Set(),
//   );

//   const broadcastCommentAdded = useCallback(
//     (data: {
//       cardId: string;
//       comment: Extract<RoomEvent, { type: "COMMENT_ADDED" }>["comment"];
//     }) => {
//       broadcast({
//         type: "COMMENT_ADDED",
//         cardId: data.cardId,
//         comment: data.comment,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastCommentUpdated = useCallback(
//     (data: {
//       cardId: string;
//       commentId: string;
//       updates: { content: string };
//     }) => {
//       broadcast({
//         type: "COMMENT_UPDATED",
//         cardId: data.cardId,
//         commentId: data.commentId,
//         updates: data.updates,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastCommentDeleted = useCallback(
//     (data: { cardId: string; commentId: string }) => {
//       broadcast({
//         type: "COMMENT_DELETED",
//         cardId: data.cardId,
//         commentId: data.commentId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastCommentReactionAdded = useCallback(
//     (data: {
//       commentId: string;
//       reaction: Extract<
//         RoomEvent,
//         { type: "COMMENT_REACTION_ADDED" }
//       >["reaction"];
//     }) => {
//       broadcast({
//         type: "COMMENT_REACTION_ADDED",
//         commentId: data.commentId,
//         reaction: data.reaction,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastCommentReactionRemoved = useCallback(
//     (data: { commentId: string; emoji: string }) => {
//       broadcast({
//         type: "COMMENT_REACTION_REMOVED",
//         commentId: data.commentId,
//         emoji: data.emoji,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   useEventListener(({ event }) => {
//     if (event.userId === user.id) return;

//     switch (event.type) {
//       case "COMMENT_ADDED":
//         setNewComments((prev) =>
//           new Map(prev).set(event.comment.id, event.comment),
//         );
//         break;

//       case "COMMENT_UPDATED":
//         setNewComments((prev) => {
//           const newMap = new Map(prev);
//           const existing = newMap.get(event.commentId);
//           if (existing) {
//             newMap.set(event.commentId, {
//               ...existing,
//               content: event.updates.content,
//             });
//           }
//           return newMap;
//         });
//         break;

//       case "COMMENT_DELETED":
//         setDeletedCommentIds((prev) => new Set(prev).add(event.commentId));
//         break;

//       case "COMMENT_REACTION_ADDED":
//         setNewComments((prev) => {
//           const newMap = new Map(prev);
//           const existing = newMap.get(event.commentId);
//           if (existing) {
//             newMap.set(event.commentId, {
//               ...existing,
//               reactions: [...existing.reactions, event.reaction],
//             });
//           }
//           return newMap;
//         });
//         break;

//       case "COMMENT_REACTION_REMOVED":
//         setNewComments((prev) => {
//           const newMap = new Map(prev);
//           const existing = newMap.get(event.commentId);
//           if (existing) {
//             newMap.set(event.commentId, {
//               ...existing,
//               reactions: existing.reactions.filter(
//                 (r: any) => r.emoji !== event.emoji,
//               ),
//             });
//           }
//           return newMap;
//         });
//         break;
//     }
//   });

//   const getNewComments = (cardId?: string) => {
//     const comments = Array.from(newComments.values());
//     return cardId ? comments.filter((c) => c.cardId === cardId) : comments;
//   };

//   const isCommentDeleted = (commentId: string) =>
//     deletedCommentIds.has(commentId);

//   return {
//     broadcastCommentAdded,
//     broadcastCommentUpdated,
//     broadcastCommentDeleted,
//     broadcastCommentReactionAdded,
//     broadcastCommentReactionRemoved,
//     getNewComments,
//     isCommentDeleted,
//   };
// };
