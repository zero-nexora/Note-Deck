// import { useEffect, useState, useCallback } from "react";
// import { useEventListener, useBroadcastEvent } from "@/lib/liveblocks";
// import { User } from "@/domain/types/user.type";
// import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";

// interface UseBoardRealtimeLabelsProps {
//   user: User;
//   initialLabels: BoardWithListLabelsAndMembers["labels"];
// }

// type Label = BoardWithListLabelsAndMembers["labels"][0];

// export const useBoardRealtimeLabels = ({
//   user,
//   initialLabels,
// }: UseBoardRealtimeLabelsProps) => {
//   const broadcast = useBroadcastEvent();
//   const [labels, setLabels] = useState<Label[]>(initialLabels);

//   useEffect(() => {
//     setLabels(initialLabels);
//   }, [initialLabels]);

//   useEventListener(({ event }) => {
//     if (event.type === "LABEL_CREATED" && event.userId !== user.id) {
//       setLabels((prev) => {
//         const exists = prev.some((l) => l.id === event.label.id);
//         if (exists) return prev;
//         return [...prev, event.label];
//       });
//     }
//   });

//   useEventListener(({ event }) => {
//     if (event.type === "LABEL_UPDATED" && event.userId !== user.id) {
//       setLabels((prev) =>
//         prev.map((label) =>
//           label.id === event.labelId ? { ...label, ...event.updates } : label,
//         ),
//       );
//     }
//   });

//   useEventListener(({ event }) => {
//     if (event.type === "LABEL_DELETED" && event.userId !== user.id) {
//       setLabels((prev) => prev.filter((label) => label.id !== event.labelId));
//     }
//   });

//   const broadcastLabelCreated = useCallback(
//     (label: Label) => {
//       broadcast({
//         type: "LABEL_CREATED",
//         label,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastLabelUpdated = useCallback(
//     ({
//       labelId,
//       updates,
//     }: {
//       labelId: string;
//       updates: { name?: string; color?: string };
//     }) => {
//       broadcast({
//         type: "LABEL_UPDATED",
//         labelId,
//         updates,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const broadcastLabelDeleted = useCallback(
//     ({ labelId }: { labelId: string }) => {
//       broadcast({
//         type: "LABEL_DELETED",
//         labelId,
//         userId: user.id,
//         timestamp: Date.now(),
//       });
//     },
//     [broadcast, user.id],
//   );

//   const addLabelLocally = useCallback((label: Label) => {
//     setLabels((prev) => {
//       const exists = prev.some((l) => l.id === label.id);
//       if (exists) return prev;
//       return [...prev, label];
//     });
//   }, []);

//   const updateLabelLocally = useCallback(
//     (labelId: string, updates: Partial<Label>) => {
//       setLabels((prev) =>
//         prev.map((label) =>
//           label.id === labelId ? { ...label, ...updates } : label,
//         ),
//       );
//     },
//     [],
//   );

//   const deleteLabelLocally = useCallback((labelId: string) => {
//     setLabels((prev) => prev.filter((label) => label.id !== labelId));
//   }, []);

//   return {
//     labels,
//     addLabelLocally,
//     updateLabelLocally,
//     deleteLabelLocally,
//     broadcastLabelCreated,
//     broadcastLabelUpdated,
//     broadcastLabelDeleted,
//   };
// };
