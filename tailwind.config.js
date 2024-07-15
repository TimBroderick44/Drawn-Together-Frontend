/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        marker: ['"Permanent Marker"', "sans-serif"],
        sketch: ['"Cabin Sketch"', "sans-serif"],
        wild: ["Delicious Handrawn", "sans-serif"],
      },
      backgroundImage: {
        stick: "url('/src/assets/stick.jpg')",
      },
    },
  },
  plugins: [],
};
