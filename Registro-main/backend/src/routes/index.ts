import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import memberRoutes from "./member.routes";
import validateRoutes from "./validate.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/members", memberRoutes);
router.use("/validate", validateRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
