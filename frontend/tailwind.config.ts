import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DesignXpress Futuristic Palette
        dx: {
          purple: "#8B5CF6",
          "purple-light": "#A78BFA",
          "purple-dark": "#6D28D9",
          orange: "#F97316",
          "orange-light": "#FB923C",
          black: "#0A0A0F",
          "black-2": "#111117",
          "black-3": "#1A1A22",
          glass: "rgba(255,255,255,0.06)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'neon-orange': '0 0 20px rgba(249, 115, 22, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
