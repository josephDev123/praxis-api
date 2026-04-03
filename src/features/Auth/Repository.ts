import type { PrismaClient } from "../../lib/prisma.js";
import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import { prismaErrorHandler } from "../../lib/utils/prismaErrorHandler.js";
import type { IUserInput } from "./schema/AuthSchema.js";

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userInput: IUserInput) {
    try {
      const result = await this.db.user.create({
        data: {
          email: userInput.email,
          name: userInput.name,
          passwordHash: userInput.password,
        },
      });
      return result;
    } catch (error) {
      prismaErrorHandler(error);
      if (error instanceof GlobalErrorHandler) {
        throw error;
      } else {
        throw new GlobalErrorHandler(
          "UnknownError",
          "something went wrong",
          500,
          false,
        );
      }
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await this.db.user.findUnique({
        where: { email },
      });
      return result;
    } catch (error) {
      prismaErrorHandler(error);

      if (error instanceof GlobalErrorHandler) {
        throw error;
      } else {
        throw new GlobalErrorHandler(
          "UnknownError",
          "something went wrong",
          500,
          false,
        );
      }
    }
  }
}
