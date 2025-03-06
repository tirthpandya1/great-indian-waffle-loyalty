/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'waffle-brown': '#8B4513',
        'waffle-red': '#A52A2A',
        'waffle-orange': '#FF8C00'
      }
    },
  },
  plugins: [],
};
