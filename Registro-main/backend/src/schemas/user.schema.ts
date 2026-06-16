import { z } from "zod";

export const rolEnum = z.enum(["ADMINISTRADOR", "REGISTRADOR"]);

export const createUserSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio."),
  correo: z.string().email("Correo inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  rol: rolEnum,
});

export const updateUserSchema = z.object({
  nombre: z.string().min(2).optional(),
  correo: z.string().email("Correo inválido.").optional(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .optional()
    .or(z.literal("")),
  rol: rolEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
