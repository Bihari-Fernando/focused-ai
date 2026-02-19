import express from "express";
import { auth } from "../middleware/auth";
import { createMood } from "../controller/moodController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", createMood);

export default router;