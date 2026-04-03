import bcrypt from "bcrypt";
import { GlobalErrorHandler } from "./GlobalErrorHandler.js";

export async function hashPassword(plainText: string) {
  try {
    const hash = await bcrypt.hash(plainText, 10);
    return hash;
  } catch (error) {
    console.log(error);
    throw new GlobalErrorHandler(
      error instanceof Error ? error?.message : "PasswordHashingError",
      "Error hashing password",
      500,
      true,
    );
    //
    throw error;
  }
}
