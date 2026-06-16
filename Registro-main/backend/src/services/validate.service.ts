import { Miembro } from "@prisma/client";
import { memberRepository } from "../repositories/member.repository";

export interface ValidationResult {
  valido: boolean;
  miembro: {
    codigoMiembro: string;
    dni: string;
    nombres: string;
    apellidos: string;
    profesion: string;
    foto: string | null;
    activo: boolean;
  } | null;
}

function toResult(member: Miembro | null): ValidationResult {
  if (!member) return { valido: false, miembro: null };
  return {
    valido: member.activo,
    miembro: {
      codigoMiembro: member.codigoMiembro,
      dni: member.dni,
      nombres: member.nombres,
      apellidos: member.apellidos,
      profesion: member.profesion,
      foto: member.foto,
      activo: member.activo,
    },
  };
}

export const validateService = {
  async byCodigo(codigo: string) {
    return toResult(await memberRepository.findByCodigo(codigo));
  },

  async byDni(dni: string) {
    return toResult(await memberRepository.findByDni(dni));
  },
};
