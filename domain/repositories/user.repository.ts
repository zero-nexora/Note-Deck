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
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  findById: async (userId: string) => {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  },

  update: async (userId: string, data: UpdateUser) => {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return updated;
  },

  delete: async (userId: string) => {
    await db.delete(users).where(eq(users.id, userId));
  },
};
