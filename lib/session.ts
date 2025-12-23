import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { userRepository } from "@/domain/repositories/user.repository";
import { getServerSession } from "next-auth/next";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) return null;

  return userRepository.findById(userId);
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
};
