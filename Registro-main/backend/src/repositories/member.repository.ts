import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export interface MemberFilters {
  search?: string; // busca en DNI, nombres, apellidos
  profesion?: string;
  sexo?: "MASCULINO" | "FEMENINO";
  estadoCivil?: "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO";
}

function buildWhere(filters: MemberFilters): Prisma.MiembroWhereInput {
  const where: Prisma.MiembroWhereInput = {};

  if (filters.search) {
    where.OR = [
      { dni: { contains: filters.search, mode: "insensitive" } },
      { nombres: { contains: filters.search, mode: "insensitive" } },
      { apellidos: { contains: filters.search, mode: "insensitive" } },
      { codigoMiembro: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.profesion) {
    where.profesion = { contains: filters.profesion, mode: "insensitive" };
  }
  if (filters.sexo) where.sexo = filters.sexo;
  if (filters.estadoCivil) where.estadoCivil = filters.estadoCivil;

  return where;
}

export const memberRepository = {
  findMany(filters: MemberFilters) {
    return prisma.miembro.findMany({
      where: buildWhere(filters),
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.miembro.findUnique({ where: { id } });
  },

  findByCodigo(codigoMiembro: string) {
    return prisma.miembro.findUnique({ where: { codigoMiembro } });
  },

  findByDni(dni: string) {
    return prisma.miembro.findUnique({ where: { dni } });
  },

  create(data: Prisma.MiembroCreateInput) {
    return prisma.miembro.create({ data });
  },

  update(id: string, data: Prisma.MiembroUpdateInput) {
    return prisma.miembro.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.miembro.delete({ where: { id } });
  },

  /** Último código generado, para calcular el siguiente correlativo. */
  findLastCodigo() {
    return prisma.miembro.findFirst({
      orderBy: { codigoMiembro: "desc" },
      select: { codigoMiembro: true },
    });
  },
};
