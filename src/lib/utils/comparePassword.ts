import bcrypt from "bcrypt";
import { GlobalErrorHandler } from "./GlobalErrorHandler.js";

export async function comparePassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  try {
    const result = await bcrypt.compare(plainText, hash);
    return result;
  } catch (error) {
    throw new GlobalErrorHandler(
      error instanceof Error ? error?.message : "PasswordComparisonError",
      "Error comparing passwords",
      500,
      true,
    );
  }
}
