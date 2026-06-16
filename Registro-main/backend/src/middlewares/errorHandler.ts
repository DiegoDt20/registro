import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Recurso no encontrado." });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    // Detalle por campo: { field, value recibido, error } — para diagnóstico.
    const validationErrors = err.issues.map((issue) => {
      const field = issue.path.join(".");
      // Valor realmente recibido para ese campo (soporta rutas anidadas).
      const value = issue.path.reduce<unknown>(
        (acc, key) => (acc != null && typeof acc === "object" ? (acc as Record<string, unknown>)[key as string] : undefined),
        req.body
      );
      return { field, value, error: issue.message, code: issue.code };
    });

    // LOG temporal de diagnóstico.
    console.warn(`[422] ${req.method} ${req.originalUrl} — validación fallida`);
    console.warn("[422] req.body:", JSON.stringify(req.body));
    console.warn("[422] validationErrors:", JSON.stringify(validationErrors, null, 2));

    return res.status(422).json({
      message: "Datos inválidos.",
      body: req.body, // TEMPORAL (diagnóstico): eco del body recibido.
      validationErrors, // [{ field, value, error }]
      errors: err.flatten().fieldErrors,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Violación de restricción única
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "campo";
      return res.status(409).json({ message: `Ya existe un registro con ese ${target}.` });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro no encontrado." });
    }
  }

  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor." });
}
