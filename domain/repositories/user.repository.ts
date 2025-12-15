import { db } from "@/db";
import { NewUser, UpdateUser, User } from "../types/user.type";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/bcrypt";

export const userRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result ?? null;
  },

  findById: async (id: string): Promise<User | null> => {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result ?? null;
  },

  create: async (data: NewUser): Promise<User> => {
    const hashedPassword = data.password
      ? await hashPassword(data.password)
      : "";

    const [newUser] = await db
      .insert(users)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();

    return newUser;
  },

  update: async (data: UpdateUser): Promise<User> => {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id!))
      .returning();

    return updatedUser;
  },

  delete: async (id: string): Promise<void> => {
    await db.delete(users).where(eq(users.id, id));
  },
};
