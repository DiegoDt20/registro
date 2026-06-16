/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta institucional: azul oscuro + dorado
        brand: {
          50: "#eef2f9",
          100: "#d6e0ef",
          600: "#1e3a5f",
          700: "#162d4a",
          800: "#0f2238",
          900: "#0a1828",
        },
        gold: {
          400: "#e6c463",
          500: "#d4af37",
          600: "#b8962e",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
