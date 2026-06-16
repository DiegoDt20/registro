import { Router } from "express";
import { memberController } from "../controllers/member.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authenticate);

// Administrador y Registrador pueden listar, ver, crear y editar.
router.get("/", asyncHandler(memberController.list));
router.get("/:id", asyncHandler(memberController.get));
router.post("/", asyncHandler(memberController.create));
router.put("/:id", asyncHandler(memberController.update));

// Solo el administrador puede eliminar.
router.delete("/:id", authorize("ADMINISTRADOR"), asyncHandler(memberController.remove));

export default router;
