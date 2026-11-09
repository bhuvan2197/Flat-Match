/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: {
          DEFAULT: '#111413',
          2: '#16201D',
          hover: '#192622',
        },
        muted: '#8A8F8C',
        mint: {
          DEFAULT: '#3DDBA5',
          glow: 'rgba(61, 219, 165, 0.4)',
          dark: '#1e684e',
        },
        yellow: {
          DEFAULT: '#F5C230',
          glow: 'rgba(245, 194, 48, 0.4)',
        },
        blue: {
          DEFAULT: '#45B5F5',
          glow: 'rgba(69, 181, 245, 0.4)',
        },
        pink: {
          DEFAULT: '#FF5C8D',
          glow: 'rgba(255, 92, 141, 0.4)',
        },
        line: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        heading: ['"Inter Tight"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'mint-glow': '0 0 40px -12px rgba(61, 219, 165, 0.4)',
        'yellow-glow': '0 0 40px -12px rgba(245, 194, 48, 0.4)',
        'blue-glow': '0 0 40px -12px rgba(69, 181, 245, 0.4)',
        'pink-glow': '0 0 40px -12px rgba(255, 92, 141, 0.4)',
      },
      letterSpacing: {
        micro: '0.08em',
      },
    },
  },
  plugins: [],
}

