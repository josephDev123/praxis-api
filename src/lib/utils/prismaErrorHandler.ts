import { GlobalErrorHandler } from "./GlobalErrorHandler.js";

import type { PrismaClient } from "../prisma.js";

import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  PrismaClientRustPanicError,
} from "@prisma/client/runtime/client";

export function prismaErrorHandler(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    // const statusMap: Record<string, number> = {
    //   P2025: 404,
    //   P2002: 409,
    //   P2003: 400,
    // };

    // const statusCode = statusMap[error.code] ?? 500;
    const statusCode = error ?? 500;

    throw new GlobalErrorHandler(error.name, error.message, 500, true);
  }

  if (error instanceof PrismaClientUnknownRequestError) {
    throw new GlobalErrorHandler(error.name, error.message, 500, true);
  }

  if (error instanceof PrismaClientInitializationError) {
    throw new GlobalErrorHandler(error.name, error.message, 500, true);
  }

  if (error instanceof PrismaClientValidationError) {
    throw new GlobalErrorHandler(error.name, error.message, 500, true);
  }

  if (error instanceof PrismaClientRustPanicError) {
    throw new GlobalErrorHandler(error.name, error.message, 500, true);
  }
}
