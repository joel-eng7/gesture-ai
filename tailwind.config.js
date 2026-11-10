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
        gesture: {
          primary: '#1677FF',
          electric: '#258BFF',
          navy: '#092B59',
          light: '#EAF4FF',
          bg: '#F7FAFF',
          white: '#FFFFFF',
          cyan: '#55D6FF',
          darkBg: '#061325',
          darkCard: '#0C1E38',
          darkBorder: '#1E3A66'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(22, 119, 255, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(22, 119, 255, 0.16)',
        'glow-blue': '0 0 25px -3px rgba(37, 139, 255, 0.45)',
        'glow-cyan': '0 0 25px -3px rgba(85, 214, 255, 0.55)',
        'card-soft': '0 4px 20px -2px rgba(9, 43, 89, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
