import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

export const userController = {
  async list(_req: Request, res: Response) {
    res.json(await userService.list());
  },

  async create(req: Request, res: Response) {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    res.status(201).json(user);
  },

  async update(req: Request, res: Response) {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(req.params.id, input);
    res.json(user);
  },

  async remove(req: Request, res: Response) {
    await userService.remove(req.params.id, req.user!.sub);
    res.status(204).send();
  },
};
