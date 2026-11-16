/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdbff',
          300: '#8ec3ff',
          400: '#58a0fe',
          500: '#317ef7',
          600: '#1d5feb',
          700: '#174acd',
          800: '#193da6',
          900: '#193683',
          950: '#102253',
        },
        navy: {
          800: '#0f172a',
          900: '#0b1120',
          950: '#060a13',
        }
      },
    },
  },
  plugins: [],
}
