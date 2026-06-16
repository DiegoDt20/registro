import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { HttpError } from "../utils/httpError";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";

export const userService = {
  list() {
    return userRepository.findAll();
  },

  async create(input: CreateUserInput) {
    const password = await bcrypt.hash(input.password, 10);
    return userRepository.create({
      nombre: input.nombre,
      correo: input.correo,
      password,
      rol: input.rol,
    });
  },

  async update(id: string, input: UpdateUserInput) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new HttpError(404, "Usuario no encontrado.");

    const data: Record<string, unknown> = {};
    if (input.nombre !== undefined) data.nombre = input.nombre;
    if (input.correo !== undefined) data.correo = input.correo;
    if (input.rol !== undefined) data.rol = input.rol;
    if (input.password) data.password = await bcrypt.hash(input.password, 10);

    return userRepository.update(id, data);
  },

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new HttpError(400, "No puedes eliminar tu propia cuenta.");
    }
    const existing = await userRepository.findById(id);
    if (!existing) throw new HttpError(404, "Usuario no encontrado.");

    // Evita quedarse sin administradores.
    if (existing.rol === "ADMINISTRADOR") {
      const total = await userRepository.findAll();
      const admins = total.filter((u) => u.rol === "ADMINISTRADOR");
      if (admins.length <= 1) {
        throw new HttpError(400, "No puedes eliminar al último administrador.");
      }
    }

    await userRepository.delete(id);
  },
};
