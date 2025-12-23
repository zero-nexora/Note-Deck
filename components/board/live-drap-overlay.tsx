import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useOthers } from "@/lib/liveblocks";
import { CardItem } from "./card-item";

interface LiveDragOverlayProps {
  board: BoardWithListColumnLabelAndMember;
}

export const LiveDragOverlay = ({ board }: LiveDragOverlayProps) => {
  const others = useOthers();

  return (
    <>
      {others.map((other) => {
        const dragState = other.presence.dragState;

        if (
          !dragState.isDragging ||
          !dragState.pointer ||
          !dragState.dragOffset
        ) {
          return null;
        }

        let draggedElement = null;

        if (dragState.dragType === "card") {
          const card = board.lists
            .flatMap((list) => list.cards)
            .find((c) => c.id === dragState.draggingId);

          if (card) {
            draggedElement = <CardItem card={card} />;
          }
        } else if (dragState.dragType === "list") {
          const list = board.lists.find((l) => l.id === dragState.draggingId);

          if (list) {
            draggedElement = (
              <div className="bg-gray-100 rounded-lg p-3 w-72 opacity-90">
                <h3 className="font-semibold">{list.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {list.cards?.length || 0} cards
                </p>
              </div>
            );
          }
        }

        if (!draggedElement) return null;

        const color = other.presence.user.color;

        return (
          <div
            key={other.connectionId}
            className="fixed pointer-events-none z-40 transition-all duration-100"
            style={{
              left: dragState.pointer.x - dragState.dragOffset.x,
              top: dragState.pointer.y - dragState.dragOffset.y,
              opacity: 0.8,
              transform: "rotate(5deg)",
            }}
          >
            <div
              className="relative"
              style={{
                filter: `drop-shadow(0 4px 6px ${color}40)`,
              }}
            >
              {draggedElement}

              <div
                className="absolute -top-8 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
                style={{
                  backgroundColor: color,
                }}
              >
                {other.presence.user.name} is dragging
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
