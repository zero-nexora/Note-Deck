// // hooks/use-board-realtime-attachments.ts
// import { User } from "@/domain/types/user.type";
// import { useCallback, useState } from "react";
// import { useBroadcastEvent, useEventListener, RoomEvent } from "@/lib/liveblocks";

// type AttachmentState = {
//   id: string;
//   cardId: string;
//   user: any;
// };

// interface UseBoardRealtimeAttachmentsProps {
//   user: User;
// }

// export const useBoardRealtimeAttachments = ({ user }: UseBoardRealtimeAttachmentsProps) => {
//   const broadcast = useBroadcastEvent();
//   const [newAttachments, setNewAttachments] = useState<Map<string, AttachmentState>>(new Map());
//   const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<Set<string>>(new Set());

//   const broadcastAttachmentCreated = useCallback(
//     (data: {
//       cardId: string;
//       attachment: Extract<RoomEvent, { type: "ATTACHMENT_CREATED" }>["attachment"];
//     }) => {
//       broadcast({
//         type: "ATTACHMENT_CREATED",
//         cardId: data.cardId,
//         attachment: data.attachment,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id]
//   );

//   const broadcastAttachmentDeleted = useCallback(
//     (data: { attachmentId: string; cardId: string }) => {
//       broadcast({
//         type: "ATTACHMENT_DELETED",
//         attachmentId: data.attachmentId,
//         cardId: data.cardId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id]
//   );

//   useEventListener(({ event }) => {
//     if (event.userId === user.id) return;

//     switch (event.type) {
//       case "ATTACHMENT_CREATED":
//         setNewAttachments((prev) => new Map(prev).set(event.attachment.id, event.attachment));
//         break;

//       case "ATTACHMENT_DELETED":
//         setDeletedAttachmentIds((prev) => new Set(prev).add(event.attachmentId));
//         break;
//     }
//   });

//   const getNewAttachments = (cardId?: string) => {
//     const attachments = Array.from(newAttachments.values());
//     return cardId ? attachments.filter((a) => a.cardId === cardId) : attachments;
//   };

//   const isAttachmentDeleted = (attachmentId: string) => deletedAttachmentIds.has(attachmentId);

//   return {
//     broadcastAttachmentCreated,
//     broadcastAttachmentDeleted,
//     getNewAttachments,
//     isAttachmentDeleted,
//   };
// };