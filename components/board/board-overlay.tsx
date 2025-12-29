"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import { BoardCardItem } from "./board-card-item";
import { BoardListItem } from "./board-list-item";
import { cardMembers } from "@/db/schema";

interface BoardOverlayProps {
  activeCard:
    | BoardWithListColumnLabelAndMember["lists"][number]["cards"][number]
    | null | undefined;
  activeList: BoardWithListColumnLabelAndMember["lists"][number] | null | undefined;
}

export const BoardOverlay = ({ activeCard, activeList }: BoardOverlayProps) => {
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        // active: {
        //   opacity: "0.5",
        // },
      },
    }),
    duration: 200,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  return (
    <DragOverlay dropAnimation={dropAnimation}>
      {activeCard ? (
        <BoardCardItem boardMembers={[]} boardLabels={[]} card={activeCard} />
      ) : activeList ? (
        <BoardListItem boardMembers={[]} boardLabels={[]} list={activeList} />
      ) : null}
    </DragOverlay>
  );
};
