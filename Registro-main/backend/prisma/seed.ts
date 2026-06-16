import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@registro.com";
  const nombre = process.env.ADMIN_NOMBRE ?? "Administrador";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const existing = await prisma.usuario.findUnique({ where: { correo: email } });
  if (existing) {
    console.log(`✔ El usuario administrador (${email}) ya existe. No se crea de nuevo.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.usuario.create({
    data: {
      nombre,
      correo: email,
      password: hashed,
      rol: "ADMINISTRADOR",
    },
  });

  console.log("✔ Usuario administrador creado:");
  console.log(`   correo:      ${email}`);
  console.log(`   contraseña:  ${password}`);
  console.log("   (cámbiala después del primer inicio de sesión)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
