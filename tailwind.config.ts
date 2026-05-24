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
      gold: '#b8973a',
      ink: '#1a1a18',
      cream: {
        DEFAULT: '#f5f2eb',
        dark: '#ede9df',
      }
    },
    fontFamily: {
      serif: ['var(--font-cormorant)', 'serif'],
    }
  }
},
  plugins: [
    require('@tailwindcss/typography')
  ],
} satisfies Config;