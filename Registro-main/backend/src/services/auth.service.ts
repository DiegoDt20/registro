import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { HttpError } from "../utils/httpError";
import { signToken } from "../utils/jwt";
import { ChangePasswordInput, LoginInput } from "../schemas/auth.schema";

export const authService = {
  async login({ correo, password }: LoginInput) {
    const user = await userRepository.findByEmailWithPassword(correo);
    if (!user) {
      throw new HttpError(401, "Credenciales incorrectas.");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new HttpError(401, "Credenciales incorrectas.");
    }

    const token = signToken({
      sub: user.id,
      rol: user.rol,
      nombre: user.nombre,
      correo: user.correo,
    });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    };
  },

  async changePassword(userId: string, { actual, nueva }: ChangePasswordInput) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new HttpError(404, "Usuario no encontrado.");
    }

    const valid = await bcrypt.compare(actual, user.password);
    if (!valid) {
      throw new HttpError(400, "La contraseña actual es incorrecta.");
    }

    const password = await bcrypt.hash(nueva, 10);
    await userRepository.update(userId, { password });
  },
};
