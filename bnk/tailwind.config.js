/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  extend: {
    colors: {
      wine: {
        DEFAULT: '#3E0014',
        dark: '#2D000E',
      },
      navy: {
        DEFAULT: '#0F172A',
        dark: '#020617',
      },
      chart: {
        blue: '#93C5FD',
      }
    },
    borderRadius: {
      '4xl': '2rem',
    }
  }
},
  plugins: [],
};