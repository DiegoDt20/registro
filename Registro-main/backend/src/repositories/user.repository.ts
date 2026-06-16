import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const safeSelect = {
  id: true,
  nombre: true,
  correo: true,
  rol: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UsuarioSelect;

export const userRepository = {
  findAll() {
    return prisma.usuario.findMany({
      select: safeSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.usuario.findUnique({ where: { id }, select: safeSelect });
  },

  findByEmailWithPassword(correo: string) {
    return prisma.usuario.findUnique({ where: { correo } });
  },

  findByIdWithPassword(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  create(data: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({ data, select: safeSelect });
  },

  update(id: string, data: Prisma.UsuarioUpdateInput) {
    return prisma.usuario.update({ where: { id }, data, select: safeSelect });
  },

  delete(id: string) {
    return prisma.usuario.delete({ where: { id } });
  },

  count() {
    return prisma.usuario.count();
  },
};
