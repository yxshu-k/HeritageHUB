/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#fdfaf3',
          100: '#f9f1de',
          200: '#f1dfbb',
          300: '#e8c78c',
          400: '#dea95f',
          500: '#d48b3b',
          600: '#c9a84c',
          700: '#a37d2e',
          800: '#826127',
          900: '#6b5024',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#3d2e0a', /* Dark Bronze */
          800: '#1a1008', /* Rich Dark Brown */
          900: '#0b0b0b', /* Pure Dark */
          950: '#050505', /* Deepest Dark */
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0b0b0b 0%, #1a0f05 50%, #2d1f0a 100%)',
        'gradient-card': 'linear-gradient(135deg, #1a1008 0%, #2d1f0a 100%)',
      },
    },
  },
  plugins: [],
}
