import { comparePassword } from "../../lib/utils/comparePassword.js";
import { createToken } from "../../lib/utils/createToken.js";
import { GlobalErrorHandler } from "../../lib/utils/GlobalErrorHandler.js";
import { hashPassword } from "../../lib/utils/hashPassword.js";
import { validationErrorHandler } from "../../lib/utils/validationErrorHandler.js";
import type { AuthRepository } from "./Repository.js";
import { userSchema, type IUserInput } from "./schema/AuthSchema.js";
import type { ITokenPayload } from "./types/IToken.js";

export class AuthService {
  constructor(
    private readonly AuthRepository: AuthRepository,
    private readonly JWT_SECRET: string,
  ) {}

  async create(userPayload: IUserInput) {
    try {
      const validationResult = validationErrorHandler(userSchema, userPayload);
      const userExists = await this.AuthRepository.findByEmail(
        validationResult.email,
      );
      console.log("userExists result:", userExists);

      if (userExists) {
        throw new GlobalErrorHandler(
          "AuthError",
          "Email already taken",
          400,
          true,
        );
      }

      //hash password
      const hash_password = await hashPassword(validationResult.password);

      const userInputWithHashedPassword: IUserInput = {
        ...validationResult,
        password: hash_password,
      };

      const result = await this.AuthRepository.create(
        userInputWithHashedPassword,
      );
      return result;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }
      throw new GlobalErrorHandler(
        "UnknownError",
        "Something went wrong",
        500,
        false,
      );
    }
  }

  async createLogin(email: string, password: string) {
    try {
      // input validation
      const validationResult = validationErrorHandler(
        userSchema.omit({ name: true }),
        {
          email,
          password,
        },
      );

      //   check if email exist
      const userExists = await this.AuthRepository.findByEmail(
        validationResult.email,
      );

      if (!userExists) {
        throw new GlobalErrorHandler(
          "AuthError",
          "The email is not yet registered",
          400,
          true,
        );
      }

      //   compare the user inputted password with the hashed password in the database
      const passwordCheck = await comparePassword(
        password,
        userExists.passwordHash,
      );

      if (!passwordCheck) {
        throw new GlobalErrorHandler(
          "AuthError",
          "Incorrect password. Please try again.",
          400,
          true,
        );
      }

      const payload: ITokenPayload = {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
      };

      //   this generate token
      const token = await createToken({
        payload: payload,
        secret: this.JWT_SECRET,
        exp: 3600000,
      });

      return {
        user: {
          id: userExists.id,
          email: userExists.email,
          name: userExists.name,
          createdAt: userExists.createdAt,
          updatedAt: userExists.updatedAt,
        },
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      } else {
        throw new GlobalErrorHandler(
          "UnknownError",
          "Something went wrong",
          500,
          false,
        );
      }
    }
  }
}
