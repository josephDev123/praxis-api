import type { Logger } from "pino";
import { App } from "./app.js";
import { loadConfig } from "./lib/config.js";
import { createLogger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

(async function startServer() {
  try {
    let config = loadConfig();
    let logger = createLogger(config.logger);
    

    // ✅ Ensure DB is connected BEFORE app starts
    await prisma.$connect();
    logger.info("Database connected");

    
    const app = await App(config, prisma, logger);
    app.listen(config.port, () => {
      logger.info({ port: config.port }, `Server is running on ${config.port}`);
    });
  } catch (error) {
    console.log({ error }, "Error starting server:");
    process.exit(1);
  }
})();
