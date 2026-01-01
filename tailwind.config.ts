import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'General Sans'", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f4fbff",
          100: "#d9f0ff",
          200: "#b0dbff",
          300: "#7ac0ff",
          400: "#55a6ff",
          500: "#3878ff",
          600: "#2b5fe6",
          700: "#2149b4",
          800: "#1b3a8c",
          900: "#162f6f"
        }
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
