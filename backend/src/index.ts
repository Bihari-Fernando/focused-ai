import { functions as inngestFunctions } from './inngest/functions';
const express = require('express');
import { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/index";
import { logger } from './utils/logger';
import { connectDB }  from "./utils/db";

const app = express();

const PORT = 3001

app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/api/chat", (req: Request, res: Response) => {
    res.send("Hi, how may I help you today?");
});

// Start server
const startServer = async () => {
    try {
      // connect to database
      await connectDB()
      // start the server
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        logger.info(
          `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
        );
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();

  //2.23
  // npx nodemon --exec ts-node src/index.ts
  // npx --ignore-scripts=false inngest-cli@latest dev -u http://localhost:3000/api/inngest