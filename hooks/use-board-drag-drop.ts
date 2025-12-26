"use client";

import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import {
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { useList } from "./use-list";
import { useCard } from "./use-card";

interface UseBoardDragDropProps {
  board: BoardWithListColumnLabelAndMember;
  startDragging: (
    type: "card" | "list",
    draggingId: string,
    dragOffset: { x: number; y: number },
    pointer: { x: number; y: number },
    sourceListId?: string | null,
    sourcePosition?: number | null
  ) => void;
  updateDragging: (pointer: { x: number; y: number }) => void;
  stopDragging: () => void;
}

interface DragState {
  activeId: UniqueIdentifier | null;
  activeType: "card" | "list" | null;
  sourceListId: string | null;
  sourcePosition: number | null;
  overId: UniqueIdentifier | null;
}

export function useBoardDragDrop({
  board,
  startDragging,
  updateDragging,
  stopDragging,
}: UseBoardDragDropProps) {
  const { reorderList } = useList();
  const { reorderCard, moveCard } = useCard();

  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    activeType: null,
    sourceListId: null,
    sourcePosition: null,
    overId: null,
  });

  const [localBoard, setLocalBoard] =
    useState<BoardWithListColumnLabelAndMember>(board);

  useEffect(() => {
    // Chỉ cập nhật localBoard khi không đang kéo thả
    if (!dragState.activeId) {
      setLocalBoard(board);
    }
  }, [board, dragState.activeId]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeId = active.id as string;

      const isDraggingList = board.lists.some((list) => list.id === activeId);
      const dragType = isDraggingList ? "list" : "card";

      let sourceListId: string | null = null;
      let sourcePosition: number | null = null;

      if (dragType === "card") {
        for (const list of board.lists) {
          const cardIndex = list.cards.findIndex((c) => c.id === activeId);
          if (cardIndex !== -1) {
            sourceListId = list.id;
            sourcePosition = list.cards[cardIndex].position;
            break;
          }
        }
      } else {
        const listIndex = board.lists.findIndex((l) => l.id === activeId);
        if (listIndex !== -1) {
          sourcePosition = board.lists[listIndex].position;
        }
      }

      setDragState({
        activeId,
        activeType: dragType,
        sourceListId,
        sourcePosition,
        overId: null,
      });

      startDragging(
        dragType,
        activeId,
        { x: 0, y: 0 },
        {
          x:
            event.activatorEvent instanceof MouseEvent
              ? event.activatorEvent.clientX
              : 0,
          y:
            event.activatorEvent instanceof MouseEvent
              ? event.activatorEvent.clientY
              : 0,
        },
        sourceListId,
        sourcePosition
      );
    },
    [board, startDragging]
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { delta, activatorEvent } = event;

      if (activatorEvent instanceof MouseEvent) {
        updateDragging({
          x: activatorEvent.clientX + delta.x,
          y: activatorEvent.clientY + delta.y,
        });
      }
    },
    [updateDragging]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || !dragState.activeType) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Cập nhật overId
      setDragState((prev) => ({ ...prev, overId }));

      if (dragState.activeType === "card") {
        const activeListId = localBoard.lists.find((list) =>
          list.cards.some((c) => c.id === activeId)
        )?.id;

        // Tìm list đích: nếu overId là list thì dùng nó, nếu là card thì tìm list chứa card đó
        let overListId: string | undefined;

        // Kiểm tra xem overId có phải là list không
        const isOverList = localBoard.lists.some((list) => list.id === overId);

        if (isOverList) {
          overListId = overId;
        } else {
          // Nếu không phải list, tìm list chứa card này
          overListId = localBoard.lists.find((list) =>
            list.cards.some((c) => c.id === overId)
          )?.id;
        }

        if (!activeListId || !overListId) return;

        // Nếu kéo trong cùng list
        if (activeListId === overListId) {
          setLocalBoard((prevBoard) => {
            const newLists = [...prevBoard.lists];
            const listIndex = newLists.findIndex((l) => l.id === activeListId);
            if (listIndex === -1) return prevBoard;

            const list = newLists[listIndex];
            const oldIndex = list.cards.findIndex((c) => c.id === activeId);

            // Nếu over là list thì thêm vào cuối, nếu là card thì tìm vị trí của card đó
            let newIndex: number;
            if (isOverList) {
              newIndex = list.cards.length - 1;
            } else {
              newIndex = list.cards.findIndex((c) => c.id === overId);
            }

            if (oldIndex === -1 || newIndex === -1) return prevBoard;
            if (oldIndex === newIndex) return prevBoard;

            newLists[listIndex] = {
              ...list,
              cards: arrayMove(list.cards, oldIndex, newIndex).map(
                (card, idx) => ({
                  ...card,
                  position: idx,
                })
              ),
            };

            return { ...prevBoard, lists: newLists };
          });
        } else {
          // Kéo sang list khác
          setLocalBoard((prevBoard) => {
            const newLists = [...prevBoard.lists];
            const activeListIndex = newLists.findIndex(
              (l) => l.id === activeListId
            );
            const overListIndex = newLists.findIndex(
              (l) => l.id === overListId
            );

            if (activeListIndex === -1 || overListIndex === -1)
              return prevBoard;

            const activeList = { ...newLists[activeListIndex] };
            const overList = { ...newLists[overListIndex] };

            const activeCardIndex = activeList.cards.findIndex(
              (c) => c.id === activeId
            );
            if (activeCardIndex === -1) return prevBoard;

            // Xóa card khỏi list cũ
            const [movedCard] = activeList.cards.splice(activeCardIndex, 1);

            // Tìm vị trí insert trong list mới
            let insertIndex: number;
            if (isOverList) {
              // Nếu kéo vào list trống hoặc vào list (không phải card cụ thể)
              insertIndex = overList.cards.length;
            } else {
              // Nếu kéo vào vị trí card cụ thể
              const overCardIndex = overList.cards.findIndex(
                (c) => c.id === overId
              );
              insertIndex =
                overCardIndex !== -1 ? overCardIndex : overList.cards.length;
            }

            // Thêm card vào list mới với listId mới
            overList.cards.splice(insertIndex, 0, {
              ...movedCard,
              listId: overListId, // CẬP NHẬT LISTID
            });

            // Cập nhật position cho cả 2 lists
            newLists[activeListIndex] = {
              ...activeList,
              cards: activeList.cards.map((card, idx) => ({
                ...card,
                position: idx,
              })),
            };

            newLists[overListIndex] = {
              ...overList,
              cards: overList.cards.map((card, idx) => ({
                ...card,
                position: idx,
              })),
            };

            return { ...prevBoard, lists: newLists };
          });
        }
      } else if (dragState.activeType === "list") {
        // Xử lý kéo list
        setLocalBoard((prevBoard) => {
          const oldIndex = prevBoard.lists.findIndex((l) => l.id === activeId);
          const newIndex = prevBoard.lists.findIndex((l) => l.id === overId);

          if (oldIndex === -1 || newIndex === -1) return prevBoard;
          if (oldIndex === newIndex) return prevBoard;

          const newLists = arrayMove(prevBoard.lists, oldIndex, newIndex).map(
            (list, idx) => ({
              ...list,
              position: idx,
            })
          );

          return { ...prevBoard, lists: newLists };
        });
      }
    },
    [dragState.activeType, localBoard.lists]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      stopDragging();

      if (!over || !dragState.activeType) {
        setDragState({
          activeId: null,
          activeType: null,
          sourceListId: null,
          sourcePosition: null,
          overId: null,
        });
        setLocalBoard(board);
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      try {
        if (dragState.activeType === "card") {
          // Tìm list hiện tại của card (sau khi drag over)
          const currentList = localBoard.lists.find((list) =>
            list.cards.some((c) => c.id === activeId)
          );

          if (!currentList) {
            throw new Error("Current list not found");
          }

          const card = currentList.cards.find((c) => c.id === activeId);
          if (!card) {
            throw new Error("Card not found");
          }

          const newPosition = card.position;
          const newListId = currentList.id;

          // Kiểm tra xem có thay đổi list không
          const hasChangedList = dragState.sourceListId !== newListId;

          if (hasChangedList) {
            // Nếu đổi list, gọi moveCard với listId và position mới
            await moveCard({
              id: activeId,
              listId: newListId,
              position: newPosition,
            });
          } else {
            // Nếu chỉ đổi vị trí trong cùng list
            const hasChangedPosition = dragState.sourcePosition !== newPosition;

            if (hasChangedPosition) {
              await reorderCard({ id: activeId, position: newPosition });
            }
          }
        } else if (dragState.activeType === "list") {
          const newIndex = localBoard.lists.findIndex((l) => l.id === activeId);
          if (newIndex === -1) {
            throw new Error("List not found");
          }

          const newPosition = localBoard.lists[newIndex].position;
          const hasChangedPosition = dragState.sourcePosition !== newPosition;

          if (hasChangedPosition) {
            await reorderList({ id: activeId, position: newPosition });
          }
        }
      } catch (error) {
        console.error("Error during drag end:", error);
        // Rollback về trạng thái ban đầu nếu có lỗi
        setLocalBoard(board);
      } finally {
        setDragState({
          activeId: null,
          activeType: null,
          sourceListId: null,
          sourcePosition: null,
          overId: null,
        });
      }
    },
    [
      dragState.activeType,
      dragState.sourceListId,
      dragState.sourcePosition,
      localBoard.lists,
      board,
      reorderCard,
      moveCard,
      reorderList,
      stopDragging,
    ]
  );

  return {
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    activeId: dragState.activeId,
    localBoard,
  };
}
