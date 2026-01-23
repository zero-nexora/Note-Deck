// import { User } from "@/domain/types/user.type";
// import { useCallback, useState } from "react";
// import {
//   useBroadcastEvent,
//   useEventListener,
//   RoomEvent,
// } from "@/lib/liveblocks";

// type CardLabelState = {
//   id: string;
//   cardId: string;
//   labelId: string;
//   label: any;
// };

// interface UseBoardRealtimeCardLabelsProps {
//   user: User;
// }

// export const useBoardRealtimeCardLabels = ({
//   user,
// }: UseBoardRealtimeCardLabelsProps) => {
//   const broadcast = useBroadcastEvent();

//   const [newCardLabels, setNewCardLabels] = useState<
//     Map<string, CardLabelState>
//   >(new Map());

//   const [deletedCardLabelIds, setDeletedCardLabelIds] = useState<Set<string>>(
//     new Set(),
//   );

//   const broadcastLabelAddedToCard = useCallback(
//     (data: {
//       cardId: string;
//       cardLabel: Extract<RoomEvent, { type: "CARD_LABEL_ADDED" }>["cardLabel"];
//     }) => {
//       broadcast({
//         type: "CARD_LABEL_ADDED",
//         cardId: data.cardId,
//         cardLabel: data.cardLabel,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastLabelRemovedFromCard = useCallback(
//     (data: { cardId: string; labelId: string }) => {
//       broadcast({
//         type: "CARD_LABEL_REMOVED",
//         cardId: data.cardId,
//         labelId: data.labelId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   useEventListener(({ event }) => {
//     if (event.userId === user.id) return;

//     switch (event.type) {
//       case "CARD_LABEL_ADDED":
//         setNewCardLabels((prev) =>
//           new Map(prev).set(event.cardLabel.id, event.cardLabel),
//         );
//         break;

//       case "CARD_LABEL_REMOVED":
//         setDeletedCardLabelIds((prev) => new Set(prev).add(event.labelId));
//         break;
//     }
//   });

//   const getNewCardLabels = (cardId?: string) => {
//     const cardLabels = Array.from(newCardLabels.values());
//     return cardId
//       ? cardLabels.filter((cl) => cl.cardId === cardId)
//       : cardLabels;
//   };

//   const isCardLabelDeleted = (labelId: string) =>
//     deletedCardLabelIds.has(labelId);

//   return {
//     broadcastLabelAddedToCard,
//     broadcastLabelRemovedFromCard,
//     getNewCardLabels,
//     isCardLabelDeleted,
//   };
// };
