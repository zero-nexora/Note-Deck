import { useOthers } from "@/lib/liveblocks";

export const LiveCursors = () => {
  const others = useOthers();

  return (
    <>
      {others.map((other) => {
        if (!other.presence.cursor) return null;

        const color = other.presence.user.color;

        return (
          <div
            key={other.connectionId}
            className="absolute pointer-events-none z-50 transition-transform duration-100"
            style={{
              left: other.presence.cursor.x,
              top: other.presence.cursor.y,
              transform: "translate(-2px, -2px)",
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
                strokeWidth="1"
              />
            </svg>
            <div
              className="absolute left-6 top-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
              style={{
                backgroundColor: color,
              }}
            >
              {other.presence.user.name}
            </div>
          </div>
        );
      })}
    </>
  );
};
