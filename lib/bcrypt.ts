import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

export async function verifyPassword(
  rawPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}
