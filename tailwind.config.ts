import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0A0A0A",
        pitch: "#000000",
        crimson: "#E31B23",
        shopam: "#FA3728",
        'theme-bg': 'var(--bg-primary)',
        'theme-bg-secondary': 'var(--bg-secondary)',
        'theme-bg-tertiary': 'var(--bg-tertiary)',
        'theme-text': 'var(--text-primary)',
        'theme-text-secondary': 'var(--text-secondary)',
        'theme-border': 'var(--border-primary)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "crimson-glow": "0 0 20px rgba(227, 27, 35, 0.5)",
        "crimson-glow-lg": "0 0 40px rgba(227, 27, 35, 0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;