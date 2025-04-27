// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // This preset is required when using global.css + className in React Native:
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
