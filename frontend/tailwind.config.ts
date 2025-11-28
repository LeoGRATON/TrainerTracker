import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Générer toutes les variantes de couleurs pour le design system
    {
      pattern: /^bg-(neutral|accent|green|red|orange)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui default colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // TriZone Custom Color System
        // Neutral (Blanc #ffffff → Noir #272832)
        neutral: {
          50: "#ffffff", // Blanc pur
          100: "#f8f8fa",
          200: "#e8e8ec",
          300: "#d1d1d8",
          400: "#a8a8b4",
          500: "#7e7e8f",
          600: "#5a5a6a",
          700: "#424250",
          800: "#33333f",
          900: "#272832", // Noir
        },

        // Accent (#F3FE39)
        accent: {
          50: "#fefff5",
          100: "#fdffea",
          200: "#fbffc9",
          300: "#f8ffa8",
          400: "#f6ff71",
          500: "#F3FE39", // Couleur principale
          600: "#d9e521",
          700: "#b3be10",
          800: "#8c9508",
          900: "#5e6303",
        },

        // Vert (#34C759)
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#34C759", // Couleur principale
          600: "#2aa84b",
          700: "#21863c",
          800: "#1a6630",
          900: "#144d25",
        },

        // Rouge (#FF383C)
        red: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ffa0a1",
          400: "#ff6a6d",
          500: "#FF383C", // Couleur principale
          600: "#e61e22",
          700: "#c21217",
          800: "#a01318",
          900: "#84171b",
        },

        // Orange (#FF8D28)
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF8D28", // Couleur principale
          600: "#ea7418",
          700: "#c25c13",
          800: "#9a4a13",
          900: "#7c3e13",
        },

        // TriZone Zones d'entraînement
        zone: {
          "1": "hsl(220, 90%, 56%)", // Bleu - Récupération
          "2": "hsl(142, 71%, 45%)", // Vert - Endurance
          "3": "hsl(48, 96%, 53%)", // Jaune - Tempo
          "4": "hsl(25, 95%, 53%)", // Orange - Seuil
          "5": "hsl(0, 84%, 60%)", // Rouge - VO2max
        },

        // Disciplines
        discipline: {
          running: "#34C759", // Vert
          cycling: "#4A90E2", // Bleu
          swimming: "#17A2B8", // Cyan
        },
      },

      fontFamily: {
        mango: ["var(--font-mango)", "system-ui", "sans-serif"],
        nohemi: ["var(--font-nohemi)", "system-ui", "sans-serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
