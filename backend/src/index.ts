import { functions as inngestFunctions } from './inngest/functions';
const express = require('express');
import { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/index";
import { logger } from './utils/logger';
import { connectDB }  from "./utils/db";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();


//middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// parse JSON bodt
app.use(express.json());

app.use("/api/inngest", serve({ client: inngest, functions: inngestFunctions }));

//routes
app.use("/auth", authRoutes);

// error handling
app.use(errorHandler);

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