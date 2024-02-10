/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',

  ],
  darkMode:"class",
  theme: {
    extend: {
    },
  },
  plugins: [
    require('@gradin/tailwindcss-scrollbar')({
      size: '5px', // width or height, default '5px'
      track: {
        background: 'lightgray', // default '#f1f1f1'
        // add other css attributes here,
        // will be merged to ::-webkit-scrollbar-track
      },
      thumb: {
        background: 'black', // default '#c1c1c1'
        borderRadius: '40px',
        // add other css attributes here,
        // will be merged to ::-webkit-scrollbar-thumb
      },
      hover: {
        background: '#525252', // default '#a8a8a8'
        borderRadius: '40px',
        // add other css attributes here,
        // will be merged to ::-webkit-scrollbar-thumb:hover
      },
    }),
  ],
}

