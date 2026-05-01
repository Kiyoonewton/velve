import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        gold: "var(--gold)",
        surface: "var(--surface)",
        border: "var(--border)",
        muted: "var(--muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Abril Fatface", "Georgia", "serif"],
        script: ["var(--font-script)", "Pacifico", "cursive"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        scaleIn: {
          "0%": { transform: "scale(1.08)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up-delay-1": "fadeUp 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up-delay-2": "fadeUp 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up-delay-3": "fadeUp 0.8s 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 3s linear infinite",
        "scale-in": "scaleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
