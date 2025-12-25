"use client";
import { BoardWithListColumnLabelAndMember } from "@/domain/types/board.type";
import { useOthers } from "@/lib/liveblocks";
import { memo } from "react";

interface LiveDragOverlayProps {
  board: BoardWithListColumnLabelAndMember;
}

const DraggedCard = memo(
  ({
    card,
    x,
    y,
    offsetX,
    offsetY,
    color,
    name,
  }: {
    card: BoardWithListColumnLabelAndMember["lists"][number]["cards"][number];
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    color: string;
    name: string;
  }) => {
    const hasCover = !!card.coverImage;

    return (
      <div
        className="fixed pointer-events-none z-40 transition-all duration-100 ease-out"
        style={{
          left: x - offsetX,
          top: y - offsetY,
        }}
      >
        {/* Card Preview */}
        <div
          className="relative rounded-lg backdrop-blur-sm border-2 shadow-2xl"
          style={{
            borderColor: `${color}80`,
            backgroundColor: `${color}10`,
            filter: `drop-shadow(0 8px 16px ${color}40)`,
          }}
        >
          <div
            className={`w-[280px] ${
              hasCover ? "h-[200px]" : "h-20"
            } rounded-lg flex items-center justify-center`}
          >
            {/* Card content preview */}
            <div className="text-center space-y-1 px-4">
              <div className="text-xs font-medium opacity-70 line-clamp-2">
                {card.title}
              </div>
            </div>
          </div>

          {/* User badge */}
          <div
            className="absolute -top-3 -right-3 px-2 py-1 rounded-full text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: color,
            }}
          >
            {name}
          </div>
        </div>
      </div>
    );
  }
);

DraggedCard.displayName = "DraggedCard";

const DraggedList = memo(
  ({
    list,
    x,
    y,
    offsetX,
    offsetY,
    color,
    name,
  }: {
    list: BoardWithListColumnLabelAndMember["lists"][number];
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    color: string;
    name: string;
  }) => {
    return (
      <div
        className="fixed pointer-events-none z-40 transition-all duration-100 ease-out"
        style={{
          left: x - offsetX,
          top: y - offsetY,
        }}
      >
        {/* List Preview */}
        <div
          className="relative rounded-2xl backdrop-blur-sm border-2 shadow-2xl"
          style={{
            borderColor: `${color}80`,
            backgroundColor: `${color}10`,
            filter: `drop-shadow(0 8px 16px ${color}40)`,
          }}
        >
          <div className="w-72 h-[400px] rounded-2xl flex flex-col">
            {/* List header preview */}
            <div className="p-3 border-b" style={{ borderColor: `${color}30` }}>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold opacity-70 truncate">
                  {list.name}
                </div>
                <div
                  className="text-xs px-1.5 py-0.5 rounded-full opacity-60"
                  style={{ backgroundColor: `${color}20` }}
                >
                  {list.cards.length}
                </div>
              </div>
            </div>

            {/* Cards preview */}
            <div className="flex-1 p-2 space-y-2 overflow-hidden">
              {list.cards.slice(0, 3).map((card) => (
                <div
                  key={card.id}
                  className="h-16 rounded-lg opacity-40"
                  style={{ backgroundColor: `${color}15` }}
                />
              ))}
              {list.cards.length > 3 && (
                <div className="text-xs text-center opacity-50 py-2">
                  +{list.cards.length - 3} more
                </div>
              )}
            </div>
          </div>

          {/* User badge */}
          <div
            className="absolute -top-3 -right-3 px-2 py-1 rounded-full text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: color,
            }}
          >
            {name}
          </div>
        </div>
      </div>
    );
  }
);

DraggedList.displayName = "DraggedList";

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

        const color = other.presence.user.color;
        const name = other.presence.user.name;

        // Dragging a card
        if (dragState.dragType === "card") {
          const card = board.lists
            .flatMap((list) => list.cards)
            .find((c) => c.id === dragState.draggingId);

          if (!card) return null;

          return (
            <DraggedCard
              key={other.connectionId}
              card={card}
              x={dragState.pointer.x}
              y={dragState.pointer.y}
              offsetX={dragState.dragOffset.x}
              offsetY={dragState.dragOffset.y}
              color={color}
              name={name}
            />
          );
        }

        // Dragging a list
        if (dragState.dragType === "list") {
          const list = board.lists.find((l) => l.id === dragState.draggingId);

          if (!list) return null;

          return (
            <DraggedList
              key={other.connectionId}
              list={list}
              x={dragState.pointer.x}
              y={dragState.pointer.y}
              offsetX={dragState.dragOffset.x}
              offsetY={dragState.dragOffset.y}
              color={color}
              name={name}
            />
          );
        }

        return null;
      })}
    </>
  );
};
