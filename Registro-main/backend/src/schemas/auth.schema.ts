import { z } from "zod";

export const loginSchema = z.object({
  correo: z.string().email("Correo inválido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    actual: z.string().min(1, "La contraseña actual es obligatoria."),
    nueva: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
  })
  .refine((data) => data.actual !== data.nueva, {
    message: "La nueva contraseña debe ser distinta de la actual.",
    path: ["nueva"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
