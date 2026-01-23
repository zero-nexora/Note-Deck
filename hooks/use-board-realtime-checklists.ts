// import { User } from "@/domain/types/user.type";
// import { useCallback, useState } from "react";
// import {
//   useBroadcastEvent,
//   RoomEvent,
//   useEventListener,
// } from "@/lib/liveblocks";

// type ChecklistState = {
//   id: string;
//   title?: string;
//   items: any[];
// };

// type ChecklistItemState = {
//   id: string;
//   checklistId: string;
//   text?: string;
//   isCompleted?: boolean;
// };

// interface UseBoardRealtimeChecklistsProps {
//   user: User;
// }

// export const useBoardRealtimeChecklists = ({
//   user,
// }: UseBoardRealtimeChecklistsProps) => {
//   const broadcast = useBroadcastEvent();
//   const [newChecklists, setNewChecklists] = useState<
//     Map<string, ChecklistState>
//   >(new Map());
//   const [deletedChecklistIds, setDeletedChecklistIds] = useState<Set<string>>(
//     new Set(),
//   );
//   const [newChecklistItems, setNewChecklistItems] = useState<
//     Map<string, ChecklistItemState>
//   >(new Map());
//   const [deletedChecklistItemIds, setDeletedChecklistItemIds] = useState<
//     Set<string>
//   >(new Set());

//   const broadcastChecklistCreated = useCallback(
//     (data: {
//       cardId: string;
//       checklist: Extract<RoomEvent, { type: "CHECKLIST_CREATED" }>["checklist"];
//     }) => {
//       broadcast({
//         type: "CHECKLIST_CREATED",
//         cardId: data.cardId,
//         checklist: data.checklist,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistUpdated = useCallback(
//     (data: { checklistId: string; updates: { title?: string } }) => {
//       broadcast({
//         type: "CHECKLIST_UPDATED",
//         checklistId: data.checklistId,
//         updates: data.updates,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistReordered = useCallback(
//     (data: { checklistId: string; position: number }) => {
//       broadcast({
//         type: "CHECKLIST_REORDERED",
//         checklistId: data.checklistId,
//         position: data.position,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistDeleted = useCallback(
//     (data: { checklistId: string; cardId: string }) => {
//       broadcast({
//         type: "CHECKLIST_DELETED",
//         checklistId: data.checklistId,
//         cardId: data.cardId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistItemCreated = useCallback(
//     (data: {
//       checklistId: string;
//       item: Extract<RoomEvent, { type: "CHECKLIST_ITEM_CREATED" }>["item"];
//     }) => {
//       broadcast({
//         type: "CHECKLIST_ITEM_CREATED",
//         checklistId: data.checklistId,
//         item: data.item,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistItemToggled = useCallback(
//     (data: {
//       itemId: string;
//       checklistId: string;
//       updates: { isCompleted: boolean };
//     }) => {
//       broadcast({
//         type: "CHECKLIST_ITEM_TOGGLED",
//         itemId: data.itemId,
//         checklistId: data.checklistId,
//         updates: data.updates,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistItemUpdated = useCallback(
//     (data: {
//       itemId: string;
//       checklistId: string;
//       updates: { text?: string };
//     }) => {
//       broadcast({
//         type: "CHECKLIST_ITEM_UPDATED",
//         itemId: data.itemId,
//         checklistId: data.checklistId,
//         updates: data.updates,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistItemReordered = useCallback(
//     (data: { itemId: string; checklistId: string; position: number }) => {
//       broadcast({
//         type: "CHECKLIST_ITEM_REORDERED",
//         itemId: data.itemId,
//         checklistId: data.checklistId,
//         position: data.position,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastChecklistItemDeleted = useCallback(
//     (data: { itemId: string; checklistId: string }) => {
//       broadcast({
//         type: "CHECKLIST_ITEM_DELETED",
//         itemId: data.itemId,
//         checklistId: data.checklistId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   useEventListener(({ event }) => {
//     if (event.userId === user.id) return;

//     switch (event.type) {
//       case "CHECKLIST_CREATED":
//         setNewChecklists((prev) =>
//           new Map(prev).set(event.checklist.id, event.checklist),
//         );
//         break;

//       case "CHECKLIST_UPDATED":
//         setNewChecklists((prev) => {
//           const newMap = new Map(prev);
//           const existing = newMap.get(event.checklistId);
//           if (existing) {
//             newMap.set(event.checklistId, { ...existing, ...event.updates });
//           }
//           return newMap;
//         });
//         break;

//       case "CHECKLIST_DELETED":
//         setDeletedChecklistIds((prev) => new Set(prev).add(event.checklistId));
//         break;

//       case "CHECKLIST_ITEM_CREATED":
//         setNewChecklistItems((prev) =>
//           new Map(prev).set(event.item.id, event.item),
//         );
//         break;

//       case "CHECKLIST_ITEM_TOGGLED":
//       case "CHECKLIST_ITEM_UPDATED":
//         setNewChecklistItems((prev) => {
//           const newMap = new Map(prev);
//           const existing = newMap.get(event.itemId);
//           if (existing) {
//             newMap.set(event.itemId, { ...existing, ...event.updates });
//           }
//           return newMap;
//         });
//         break;

//       case "CHECKLIST_ITEM_DELETED":
//         setDeletedChecklistItemIds((prev) => new Set(prev).add(event.itemId));
//         break;
//     }
//   });

//   const getNewChecklists = (cardId?: string) => {
//     const checklists = Array.from(newChecklists.values());
//     return cardId
//       ? checklists.filter((cl: any) => cl.cardId === cardId)
//       : checklists;
//   };

//   const isChecklistDeleted = (checklistId: string) =>
//     deletedChecklistIds.has(checklistId);

//   const getNewChecklistItems = (checklistId?: string) => {
//     const items = Array.from(newChecklistItems.values());
//     return checklistId
//       ? items.filter((item) => item.checklistId === checklistId)
//       : items;
//   };

//   const isChecklistItemDeleted = (itemId: string) =>
//     deletedChecklistItemIds.has(itemId);

//   return {
//     broadcastChecklistCreated,
//     broadcastChecklistUpdated,
//     broadcastChecklistReordered,
//     broadcastChecklistDeleted,
//     broadcastChecklistItemCreated,
//     broadcastChecklistItemToggled,
//     broadcastChecklistItemUpdated,
//     broadcastChecklistItemReordered,
//     broadcastChecklistItemDeleted,
//     getNewChecklists,
//     isChecklistDeleted,
//     getNewChecklistItems,
//     isChecklistItemDeleted,
//   };
// };
