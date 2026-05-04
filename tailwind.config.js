/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // teal-500
        secondary: "#8b5cf6", // violet-500
        darkBg: "#0f172a", // slate-900
        darkCard: "#1e293b", // slate-800
      }
    },
  },
  plugins: [],
}
