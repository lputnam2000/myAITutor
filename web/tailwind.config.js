/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/home.js",
  ],
  theme: {
    extend: {
      colors: {
        cbwhite: '#FBFBFF',
        cbpink: "#FF1F8F",
        cbblue: "#1FDDFF",
        cbgreen: "#39FF14",
        cbblack: "#000000",
      },
    },
    
  },
  plugins: [],
}