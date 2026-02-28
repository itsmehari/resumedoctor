import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef4fc",
          100: "#dce9f9",
          200: "#b9d3f3",
          300: "#8fb8eb",
          400: "#5c96e0",
          500: "#1a73e8",
          600: "#0d65d9",
          700: "#0a54b8",
          800: "#0c4596",
          900: "#0c4a6e",
        },
        accent: {
          DEFAULT: "#FFB900",
          hover: "#e6a700",
          dark: "#664d00",
        },
        success: {
          DEFAULT: "#22c55e",
          light: "#dcfce7",
        },
      },
    },
  },
  plugins: [],
};

export default config;
