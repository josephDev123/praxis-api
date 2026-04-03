import z from "zod";
import dotenv from "dotenv";

export const configSchema = z.object({
  port: z.coerce.number().default(4000),
  logger: z.object({
    level: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),
    pretty: z.coerce.boolean().default(false),
  }),
  DATABASE_URL: z.string().min(5),
  JWT_SECRET: z.string().min(5),
  ALLOW_ORIGIN: z.string(),
});

export type IConfig = z.infer<typeof configSchema>;
export type LoggerConfig = z.output<typeof configSchema.shape.logger>;

export type ILevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export function loadConfig() {
  dotenv.config();
  const envConfig: IConfig = {
    port: Number(process.env.PORT) || 4000,
    logger: {
      level: (process.env.LOG_LEVEL as ILevel) || "info",
      pretty: process.env.LOG_PRETTY === "true",
    },
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    ALLOW_ORIGIN: process.env.ALLOW_ORIGIN!,
  };

  const config = configSchema.parse(envConfig);
  return config;
}
