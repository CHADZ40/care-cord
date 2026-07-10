/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dashboard side — an operations-log palette.
        ink: '#1C2B39',
        paper: '#F7F5F0',
        rule: '#D8D2C4',
        // Shared "presence" accent — means the same thing everywhere:
        // something is pending / needs a human's attention.
        signal: {
          DEFAULT: '#E2A542',
          soft: '#F3D9A6',
          deep: '#B97D22'
        },
        confirmed: '#4C7A63',
        alert: '#B24C3E',
        // Elder side — a warmer, brighter, single-object palette.
        elder: {
          bg: '#FBF3E4',
          ink: '#3B2A3F',
          card: '#FFFDF8'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(226,165,66,0.35)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 22px rgba(226,165,66,0)' }
        },
        listening: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.09)' }
        }
      },
      animation: {
        breathe: 'breathe 3.2s ease-in-out infinite',
        listening: 'listening 0.9s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
