import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";

type Rol = "ADMINISTRADOR" | "REGISTRADOR";

/**
 * Restringe el acceso a los roles indicados.
 * Ej: authorize("ADMINISTRADOR") permite solo administradores.
 */
export function authorize(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new HttpError(401, "No autenticado.");
    }
    if (!roles.includes(req.user.rol)) {
      throw new HttpError(403, "No tienes permisos para realizar esta acción.");
    }
    next();
  };
}
