"use client";

import { useBoardRealtimePresence } from "@/hooks/use-board-realtime-presence";
import { memo } from "react";

const Cursor = memo(
  ({
    x,
    y,
    color,
    name,
  }: {
    x: number;
    y: number;
    color: string;
    name: string;
  }) => {
    return (
      <div
        className="pointer-events-none absolute z-50 transition-transform duration-100"
        style={{
          left: x,
          top: y,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.65376 12.3673L13.6654 4.35564L18.2845 8.97479L10.2729 16.9864L5.65376 12.3673Z"
            fill={color}
          />
          <path
            d="M5.65376 12.3673L13.6654 4.35564L18.2845 8.97479L10.2729 16.9864L5.65376 12.3673Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="ml-6 -mt-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
          style={{
            backgroundColor: color,
          }}
        >
          {name}
        </div>
      </div>
    );
  },
);

Cursor.displayName = "Cursor";

export const LiveCursors = () => {
  const { otherUsers } = useBoardRealtimePresence();

  return (
    <>
      {otherUsers.map((other) => {
        if (!other.cursor) return null;
        return (
          <Cursor
            key={other.connectionId}
            x={other.cursor.x}
            y={other.cursor.y}
            color={other.user.color}
            name={other.user.name}
          />
        );
      })}
    </>
  );
};
