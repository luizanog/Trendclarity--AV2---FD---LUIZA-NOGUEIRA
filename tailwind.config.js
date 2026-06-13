/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ede9ff',
          100: '#d4caff',
          200: '#b3a4ff',
          400: '#9b77ff',
          500: '#7c5cfc',
          600: '#6c47ff',
          800: '#3b1d8a',
        },
        coral: '#ff6b6b',
        peach: '#ffb07a',
        yellow: '#ffd166',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
