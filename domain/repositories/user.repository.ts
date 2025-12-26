import { db } from "@/db";
import { NewUser, UpdateUser } from "../types/user.type";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const userRepository = {
  create: async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  findByEmail: async (email: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  },

  findById: async (id: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  },

  update: async (id: string, data: UpdateUser) => {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    await db.delete(users).where(eq(users.id, id));
  },
};
