// import { User } from "@/domain/types/user.type";
// import { useCallback, useState } from "react";
// import {
//   useBroadcastEvent,
//   useEventListener,
//   RoomEvent,
// } from "@/lib/liveblocks";

// type CardMemberState = {
//   id: string;
//   cardId: string;
//   userId: string;
//   user: any;
// };

// interface UseBoardRealtimeMembersProps {
//   user: User;
// }

// export const useBoardRealtimeMembers = ({
//   user,
// }: UseBoardRealtimeMembersProps) => {
//   const broadcast = useBroadcastEvent();
//   const [newCardMembers, setNewCardMembers] = useState<
//     Map<string, CardMemberState>
//   >(new Map());
//   const [deletedCardMemberIds, setDeletedCardMemberIds] = useState<Set<string>>(
//     new Set(),
//   );

//   const broadcastMemberAssignedToCard = useCallback(
//     (data: {
//       cardId: string;
//       cardMember: Extract<
//         RoomEvent,
//         { type: "CARD_MEMBER_ASSIGNED" }
//       >["cardMember"];
//     }) => {
//       broadcast({
//         type: "CARD_MEMBER_ASSIGNED",
//         cardId: data.cardId,
//         cardMember: data.cardMember,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastMemberUnassignedFromCard = useCallback(
//     (data: { cardId: string; memberId: string }) => {
//       broadcast({
//         type: "CARD_MEMBER_UNASSIGNED",
//         cardId: data.cardId,
//         memberId: data.memberId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   useEventListener(({ event }) => {
//     if (event.userId === user.id) return;

//     switch (event.type) {
//       case "CARD_MEMBER_ASSIGNED":
//         setNewCardMembers((prev) =>
//           new Map(prev).set(event.cardMember.id, event.cardMember),
//         );
//         break;

//       case "CARD_MEMBER_UNASSIGNED":
//         setDeletedCardMemberIds((prev) => new Set(prev).add(event.memberId));
//         break;
//     }
//   });

//   const getNewCardMembers = (cardId?: string) => {
//     const members = Array.from(newCardMembers.values());
//     return cardId ? members.filter((m) => m.cardId === cardId) : members;
//   };

//   const isCardMemberDeleted = (memberId: string) =>
//     deletedCardMemberIds.has(memberId);

//   return {
//     broadcastMemberAssignedToCard,
//     broadcastMemberUnassignedFromCard,
//     getNewCardMembers,
//     isCardMemberDeleted,
//   };
// };
