import * as bcrypt from 'bcrypt';

export async function hashPassword(
  password: string,
  saltRounds = 8,
): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
