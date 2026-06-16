import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "No autenticado. Falta el token de acceso.");
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new HttpError(401, "Token inválido o expirado.");
  }
}
