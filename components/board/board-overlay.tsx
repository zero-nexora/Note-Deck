"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { DragOverlay } from "@dnd-kit/core";
import { BoardCardItem } from "./board-card-item";
import { BoardListItem } from "./board-list-item";

interface BoardOverlayProps {
  activeCard:
    | BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]
    | null;
  activeList: BoardWithListColumnLabelAndMember["lists"][number] | null;
}

export const BoardOverlay = ({ activeCard, activeList }: BoardOverlayProps) => {
  return (
    <DragOverlay
      dropAnimation={{
        duration: 200,
        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
      }}
    >
      {activeCard ? (
        <div className="cursor-grabbing opacity-50">
          <BoardCardItem card={activeCard} isOverlay />
        </div>
      ) : activeList ? (
        <div className="cursor-grabbing opacity-50">
          <BoardListItem list={activeList} isOverlay />
        </div>
      ) : null}
    </DragOverlay>
  );
};
