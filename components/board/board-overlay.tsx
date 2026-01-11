"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import { BoardCardItem } from "./board-card-item";
import { BoardListItem } from "./board-list-item";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardOverlayProps {
  activeCard:
    | BoardWithListLabelsAndMembers["lists"][number]["cards"][number]
    | null | undefined;
  activeList: BoardWithListLabelsAndMembers["lists"][number] | null | undefined;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardOverlay = ({ activeCard, activeList, realtimeUtils }: BoardOverlayProps) => {
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          // opacity: "0.5",
          rotate: "2deg",
          scale: "1.05",
        },
      },
    }),
    duration: 200,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  return (
    <DragOverlay dropAnimation={dropAnimation} className="rotate-2">
      {activeCard ? (
        <BoardCardItem realtimeUtils={realtimeUtils} boardMembers={[]} boardLabels={[]} card={activeCard} />
      ) : activeList ? (
        <BoardListItem realtimeUtils={realtimeUtils} boardMembers={[]} boardLabels={[]} list={activeList} />
      ) : null}
    </DragOverlay>
  );
};
