/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 214 32% 91%))",
        input: "hsl(var(--input, 214 32% 91%))",
        ring: "hsl(var(--ring, 142 76% 36%))",
        background: "hsl(var(--background, 222 47% 11%))",
        foreground: "hsl(var(--foreground, 210 40% 98%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 142 71% 45%))",
          foreground: "hsl(var(--primary-foreground, 144 80% 10%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 217 33% 17%))",
          foreground: "hsl(var(--secondary-foreground, 210 40% 98%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 217 33% 17%))",
          foreground: "hsl(var(--muted-foreground, 215 20% 65%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 173 80% 40%))",
          foreground: "hsl(var(--accent-foreground, 173 90% 10%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 222 47% 13%))",
          foreground: "hsl(var(--card-foreground, 210 40% 98%))",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}
