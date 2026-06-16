import { Router } from "express";
import { validateController } from "../controllers/validate.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/dni/:dni", asyncHandler(validateController.byDni));
router.get("/:codigo", asyncHandler(validateController.byCodigo));

export default router;
