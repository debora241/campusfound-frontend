import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          50: "#EEF1F7",
          100: "#D6DCEA",
          300: "#8492B8",
          500: "#3C4E80",
          700: "#1C2A4E",
          900: "#0B1327",
        },
        paper: {
          DEFAULT: "#F7F7F5",
          dark: "#0F1420",
        },
        gold: {
          DEFAULT: "#C89B3C",
          light: "#E8CE8F",
          dark: "#8F6D24",
        },
        verified: {
          DEFAULT: "#1F7A5C",
          light: "#DCEFE7",
        },
        alert: {
          DEFAULT: "#B3432B",
          light: "#F6E1DB",
        },
        line: "#E2E1DC",
        "line-dark": "#232A3B",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["\"Source Serif 4\"", "ui-serif", "Georgia", "serif"],
        mono: ["\"JetBrains Mono\"", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.04), 0 4px 16px rgba(20,33,61,0.06)",
        seal: "0 0 0 4px rgba(200,155,60,0.15)",
      },
      keyframes: {
        "seal-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.04)", opacity: "0.85" },
        },
      },
      animation: {
        "seal-pulse": "seal-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
