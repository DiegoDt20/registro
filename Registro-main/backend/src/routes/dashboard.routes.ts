import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);
router.get("/stats", asyncHandler(dashboardController.stats));

export default router;
