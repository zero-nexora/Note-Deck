import { getCurrentUser } from "@/lib/session";
import { Liveblocks } from "@liveblocks/node";

export async function POST(request: Request) {
  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY,
  });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.name || "",
      image: user.image,
    },
  });

  const { room } = await request.json();

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
