/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2321",
        paper: "#F7F5EF",
        forest: {
          50: "#EEF5F0",
          100: "#DCEAE0",
          200: "#B4D3BE",
          500: "#3A8360",
          600: "#2F6E52",
          700: "#24543F",
          800: "#1B3F30"
        },
        gold: {
          50: "#FBF4E6",
          100: "#F6E7C6",
          500: "#D69A34",
          600: "#C98A2C",
          700: "#AD7420"
        },
        sand: {
          200: "#E7E2D3",
          300: "#D8D2BE",
          400: "#C2BAA0"
        },
        rust: {
          50: "#FBEAE8",
          500: "#C24A43",
          600: "#B23A34",
          700: "#8F2E29"
        }
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28, 35, 33, 0.04), 0 8px 24px rgba(28, 35, 33, 0.06)"
      }
    }
  },
  plugins: []
};
