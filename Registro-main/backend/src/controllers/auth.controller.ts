import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { changePasswordSchema, loginSchema } from "../schemas/auth.schema";

export const authController = {
  async login(req: Request, res: Response) {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json(result);
  },

  async me(req: Request, res: Response) {
    res.json({ user: req.user });
  },

  async changePassword(req: Request, res: Response) {
    const input = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user!.sub, input);
    res.json({ message: "Contraseña actualizada correctamente." });
  },
};
