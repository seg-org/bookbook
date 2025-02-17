import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns: {
        "auto-fit-400": "repeat(auto-fit, minmax(400px, 1fr))",
      },
      keyframes: {
        glow: {
          "0%": { backgroundColor: "#e0e0e0" },
          "50%": { backgroundColor: "#cfcfcf" },
          "100%": { backgroundColor: "#e0e0e0" },
        },
      },
      animation: {
        glow: "glow 1.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
