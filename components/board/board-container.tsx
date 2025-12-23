"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { generateUserColor, RoomProvider } from "@/lib/liveblocks";
import { BoardContent } from "./board-content";

interface BoardContainerProps {
  board: BoardWithListColumnLabelAndMember;
}

export const BoardContainer = ({ board }: BoardContainerProps) => {
  const userColor = generateUserColor("");
  return (
    <RoomProvider
      id={board.id}
      initialPresence={{
        cursor: null,
        selectedCardId: null,
        editingCardId: null,
        editingField: null,
        dragState: {
          isDragging: false,
          dragType: null,
          draggingId: null,
          dragOffset: null,
          pointer: null,
          sourceListId: null,
          sourcePosition: null,
        },
        user: {
          id: "",
          name: "",
          avatar: "",
          color: "",
        },
      }}
      initialStorage={{
        lists: [],
      }}
    >
      <BoardContent board={board} />
    </RoomProvider>
  );
};
