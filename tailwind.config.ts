import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d2d2d',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'glow': {
          '0%': {
            'box-shadow': '0 0 5px rgb(34 197 94 / 0.2), 0 0 20px rgb(34 197 94 / 0.2), 0 0 30px rgb(34 197 94 / 0.2)',
          },
          '100%': {
            'box-shadow': '0 0 10px rgb(34 197 94 / 0.4), 0 0 40px rgb(34 197 94 / 0.4), 0 0 50px rgb(34 197 94 / 0.4)',
          },
        }
      }
    },
  },
  plugins: [],
}