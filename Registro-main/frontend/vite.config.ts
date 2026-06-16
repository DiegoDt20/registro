import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Puerto dedicado para este proyecto (5173 suele estar ocupado por otro).
    port: 5180,
  },
});
