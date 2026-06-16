import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/login", asyncHandler(authController.login));
router.get("/me", authenticate, asyncHandler(authController.me));
router.post("/change-password", authenticate, asyncHandler(authController.changePassword));

export default router;
