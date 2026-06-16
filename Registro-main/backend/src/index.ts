import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

async function bootstrap() {
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 API escuchando en http://localhost:${env.port}/api`);
  });
}

bootstrap().catch(async (err) => {
  console.error("No se pudo iniciar el servidor:", err);
  await prisma.$disconnect();
  process.exit(1);
});
