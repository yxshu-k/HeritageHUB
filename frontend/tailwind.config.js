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
          50: '#fef9f3',
          100: '#fdf0e6',
          200: '#fce3d5',
          300: '#fad5be',
          400: '#f5b894',
          500: '#d4a574',
          600: '#c9a84c',
          700: '#9d8436',
          800: '#6b5b2f',
          900: '#3d3319',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#0b0b0b',
          800: '#111111',
          700: '#1a1a1a',
          600: '#2d2d2d',
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
