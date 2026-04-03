import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PrismaClientType } from "./generated/prisma/client.js";

export type PrismaClient = PrismaClientType;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClientType({ adapter });

export { prisma };
