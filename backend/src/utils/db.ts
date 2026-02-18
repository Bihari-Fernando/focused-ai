import mongoose from "mongoose";
import { logger } from './logger';

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://biharifernando2000_db_user:6DE7YioKHXMn3PgX@focused-ai.lzpswbo.mongodb.net/?appName=focused-ai";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        logger.info("Connected to MongoDB Atlas");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
}