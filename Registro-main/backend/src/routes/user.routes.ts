import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

// Solo el administrador gestiona usuarios.
router.use(authenticate, authorize("ADMINISTRADOR"));

router.get("/", asyncHandler(userController.list));
router.post("/", asyncHandler(userController.create));
router.put("/:id", asyncHandler(userController.update));
router.delete("/:id", asyncHandler(userController.remove));

export default router;
