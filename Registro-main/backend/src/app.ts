import express from "express";
import cors from "cors";
import routes from "./routes";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        // Permite herramientas sin origen (curl, Postman) y cualquier localhost
        // en desarrollo, además del origen configurado explícitamente.
        if (
          !origin ||
          origin === env.corsOrigin ||
          /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
        ) {
          return callback(null, true);
        }
        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
      },
    })
  );
  // Las fotos viajan como Data URL (base64) dentro del JSON; subimos el límite.
  app.use(express.json({ limit: "8mb" }));
  app.use(express.urlencoded({ extended: true, limit: "8mb" }));

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
