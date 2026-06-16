import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  async stats(_req: Request, res: Response) {
    res.json(await dashboardService.stats());
  },
};
