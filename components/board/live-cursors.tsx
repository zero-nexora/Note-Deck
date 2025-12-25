"use client";
import { useOthers } from "@/lib/liveblocks";
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
        className="absolute pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: x,
          top: y,
          transform: "translate(-2px, -2px)",
        }}
      >
        {/* Cursor SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
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

        {/* User name tag */}
        <div
          className="absolute left-6 top-0 px-2 py-1 rounded-md text-xs font-medium text-white whitespace-nowrap shadow-lg"
          style={{
            backgroundColor: color,
          }}
        >
          {name}
        </div>
      </div>
    );
  }
);

Cursor.displayName = "Cursor";

export const LiveCursors = () => {
  const others = useOthers();

  return (
    <>
      {others.map((other) => {
        if (!other.presence.cursor) return null;

        const color = other.presence.user.color;
        const name = other.presence.user.name;

        return (
          <Cursor
            key={other.connectionId}
            x={other.presence.cursor.x}
            y={other.presence.cursor.y}
            color={color}
            name={name}
          />
        );
      })}
    </>
  );
};
