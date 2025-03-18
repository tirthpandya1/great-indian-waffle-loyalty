/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'waffle-brown': '#5D4037',
        'waffle-red': '#B71C1C',
        'waffle-orange': '#FFB74D',
        'waffle-light': '#FFF8E1'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
};
