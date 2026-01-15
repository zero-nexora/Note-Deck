import { auth } from "@/auth";
import { userRepository } from "@/domain/repositories/user.repository";

export const getCurrentUser = async () => {
  const session = await auth()
  const userId = session?.user.id;
  if (!userId) return null;

  return userRepository.findById(userId);
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
};
