import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        keyframes: {
        slideFadeIn: {
          "0%": { opacity: "0", transform: "translateX(80px) scale(0.95)" },
          "100%": { opacitX: "1", transform: "translateX(0) scale(1)" },
        },
        slideFadeOut: {
          "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateX(80px) scale(0.95)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'bounce-shake': {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-3px) rotate(2deg)' },
          '50%': { transform: 'translateY(0) rotate(0eg)' },
          '75%': { transform: 'translateX(-6px) rotate(-10deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        slideFadeIn: "slideFadeIn 0.6s ease-out forwards",
        slideFadeOut: "slideFadeOut 0.6s ease-in forwards",
        slideInLeft: "slideInLeft 0.5s ease-out forwards",
        shake: 'shake 2.6s ease-in-out both infinite',
        'bounce-shake': 'bounce-shake 4s ease-in-out both infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} satisfies Config;