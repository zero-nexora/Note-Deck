"use client";

import { BoardWithListLabelsAndMembers } from "@/domain/types/board.type";
import {
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { BoardCardItem } from "./board-card-item";
import { BoardListItem } from "./board-list-item";
import { useBoardRealtime } from "@/hooks/use-board-realtime";

interface BoardOverlayProps {
  activeCard:
    | BoardWithListLabelsAndMembers["lists"][number]["cards"][number]
    | null
    | undefined;
  activeList: BoardWithListLabelsAndMembers["lists"][number] | null | undefined;
  realtimeUtils: ReturnType<typeof useBoardRealtime>;
}

export const BoardOverlay = ({
  activeCard,
  activeList,
  realtimeUtils,
}: BoardOverlayProps) => {
  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
    duration: 250,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  return (
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      style={{
        cursor: activeCard || activeList ? "grabbing" : "grab",
      }}
      zIndex={9999}
    >
      {activeCard ? (
        <div
          style={{
            transform: "rotate(3deg) scale(1.05)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            outline: "2px solid hsl(var(--primary) / 0.5)",
            outlineOffset: "2px",
            transition: "all 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
          className="rounded-lg"
        >
          <BoardCardItem
            realtimeUtils={realtimeUtils}
            boardMembers={[]}
            boardLabels={[]}
            card={activeCard}
          />
        </div>
      ) : activeList ? (
        <div
          style={{
            transform: "rotate(2deg) scale(1.02)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            outline: "2px solid hsl(var(--primary) / 0.5)",
            outlineOffset: "2px",
            transition: "all 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            maxWidth: "350px",
          }}
          className="rounded-lg"
        >
          <BoardListItem
            realtimeUtils={realtimeUtils}
            boardMembers={[]}
            boardLabels={[]}
            list={activeList}
          />
        </div>
      ) : null}
    </DragOverlay>
  );
};
