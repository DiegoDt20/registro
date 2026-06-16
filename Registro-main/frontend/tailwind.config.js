/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F4F8FB",
          100: "#E3EDF5",
          200: "#C7DBEA",
          300: "#A8C6DD",
          400: "#7FA8C9",
          500: "#5B89B0",
          600: "#5588B1",
          700: "#4F7A9E",
          800: "#456A89",
          900: "#324D62",
        },

        gold: {
          50: "#FFFFFF",
          100: "#F8FAFC",
          200: "#EEF2F7",
          300: "#E3EDF5",
          400: "#DCEAF4",
          500: "#FFFFFF",
          600: "#E3EDF5",
        },

        background: "#F4F8FB",
        surface: "#FFFFFF",
        border: "#DCEAF4",
        textPrimary: "#324D62",
        textSecondary: "#5588B1",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },

  plugins: [],
};
