/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      cbwhite: '#FBFBFF',
      cbpink: "#FF1F8F",
      cbblue: "#1FDDFF",
      cbgreen: "#39FF14",
      cbblack: "#000000",
    },
  },
  plugins: [],
}