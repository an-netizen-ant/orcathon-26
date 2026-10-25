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
        space: {
          975: '#020409',
          950: '#040711',
          900: '#070c1e',
          850: '#0b132b',
          800: '#101c3d',
          700: '#172754',
          600: '#223873',
        },
        telemetry: {
          cyan: '#00E5FF',
          emerald: '#00FFA3',
          amber: '#F59E0B',
          crimson: '#ef4444',
          violet: '#a855f7',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -4px rgba(0, 229, 255, 0.5)',
        'glow-emerald': '0 0 20px -4px rgba(0, 255, 163, 0.5)',
        'glow-laser': '0 0 12px 2px rgba(0, 229, 255, 0.85), 0 0 28px 5px rgba(0, 255, 163, 0.35)',
        'cockpit': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.06), 0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'hud-blink': 'hudBlink 1.4s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hudBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.07)',
      },
    },
  },
  plugins: [],
}
