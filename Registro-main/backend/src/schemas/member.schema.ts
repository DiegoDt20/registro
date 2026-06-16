import { z } from "zod";

export const sexoEnum = z.enum(["MASCULINO", "FEMENINO"]);
export const estadoCivilEnum = z.enum(["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO"]);

const baseMember = {
  dni: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos."),
  nombres: z.string().trim().min(2, "Los nombres son obligatorios."),
  apellidos: z.string().trim().min(2, "Los apellidos son obligatorios."),
  sexo: sexoEnum,
  estadoCivil: estadoCivilEnum,
  profesion: z.string().trim().min(2, "La profesión es obligatoria."),
  fechaNacimiento: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha de nacimiento inválida."),
  celular: z
    .string()
    .trim()
    .regex(/^\d{6,15}$/, "El celular debe contener solo dígitos (6 a 15)."),
  // Opcional: acepta email válido, "" o null (el frontend envía null cuando va vacío).
  correo: z.string().email("Correo inválido.").or(z.literal("")).nullish(),
  direccion: z.string().trim().min(3, "La dirección es obligatoria."),
  // Data URL (data:image/...;base64,....) o URL. Opcional: string, "" o null.
  foto: z.string().nullish(),
};

export const createMemberSchema = z.object(baseMember);

export const updateMemberSchema = z.object({
  ...baseMember,
  activo: z.boolean().optional(),
}).partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
