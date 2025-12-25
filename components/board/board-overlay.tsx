"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { defaultDropAnimationSideEffects, DragOverlay } from "@dnd-kit/core";
import { BoardCardItem } from "./board-card-item";
import { BoardListItem } from "./board-list-item";

interface BoardOverlayProps {
  activeCard:
    | BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]
    | null;
  activeList: BoardWithListColumnLabelAndMember["lists"][number] | null;
}

export const BoardOverlay = ({ activeCard, activeList }: BoardOverlayProps) => {
  const dropAnimation = {
    duration: 200,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DragOverlay dropAnimation={dropAnimation}>
      {activeCard ? (
        <div className="cursor-grabbing transition-transform opacity-50">
          <BoardCardItem card={activeCard} isOverlay />
        </div>
      ) : activeList ? (
        <div className="cursor-grabbing transition-transform opacity-50">
          <BoardListItem list={activeList} isOverlay />
        </div>
      ) : null}
    </DragOverlay>
  );
};
