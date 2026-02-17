import { functions } from './inngest/index';
const express = require('express');
import { Request, Response } from "express";
import { serve } from "inngest/express";
import { Inngest } from "inngest";
import { logger } from './utils/logger';

const app = express();

const PORT = 3000

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/api/chat", (req: Request, res: Response) => {
    res.send("Hi, how may I help you today?");
});

// Start server
const startServer = async () => {
    try {
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