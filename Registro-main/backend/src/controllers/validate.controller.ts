import { Request, Response } from "express";
import { validateService } from "../services/validate.service";

export const validateController = {
  async byCodigo(req: Request, res: Response) {
    res.json(await validateService.byCodigo(req.params.codigo));
  },

  async byDni(req: Request, res: Response) {
    res.json(await validateService.byDni(req.params.dni));
  },
};
