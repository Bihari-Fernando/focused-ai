import express from "express";
import { auth } from "../middleware/auth";
import { getDashboardOverview } from "../controllers/dashboardController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Get today's dashboard overview
router.get("/overview", getDashboardOverview);

export default router;
