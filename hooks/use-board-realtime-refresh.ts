import { useEventListener } from "@/lib/liveblocks";

interface UseBoardRealtimeRefreshProps {
  onRefresh?: () => void;
}

export const useBoardRealtimeRefresh = ({
  onRefresh,
}: UseBoardRealtimeRefreshProps) => {
  useEventListener(({ event }) => {
    const refreshEvents = [
      "BOARD_UPDATED",
      "BOARD_ARCHIVED",
      "BOARD_RESTORED",
      "BOARD_DELETED",
      "BOARD_MEMBER_ADDED",
      "BOARD_MEMBER_REMOVED",
      "BOARD_MEMBER_ROLE_CHANGED",
      "LIST_REORDERED",
      // "LIST_DUPLICATED",
      "CARD_MOVED",
      "CARD_REORDERED",
      // "CARD_DUPLICATED",
      "ATTACHMENT_CREATED",
      "ATTACHMENT_DELETED",
      "CARD_MEMBER_ASSIGNED",
      "CARD_MEMBER_UNASSIGNED",
      "CARD_LABEL_ADDED",
      "CARD_LABEL_REMOVED",
      "CHECKLIST_CREATED",
      "CHECKLIST_UPDATED",
      "CHECKLIST_REORDERED",
      "CHECKLIST_DELETED",
      "CHECKLIST_ITEM_CREATED",
      "CHECKLIST_ITEM_TOGGLED",
      "CHECKLIST_ITEM_UPDATED",
      "CHECKLIST_ITEM_REORDERED",
      "CHECKLIST_ITEM_DELETED",
      "COMMENT_ADDED",
      "COMMENT_UPDATED",
      "COMMENT_DELETED",
      "COMMENT_REACTION_ADDED",
      "COMMENT_REACTION_REMOVED",
    ];

    if (refreshEvents.includes(event.type)) {
      onRefresh?.();
    }
  });
};
