/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: ["light", "dark"]
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
      },
      gridTemplateColumns: {
        18: "repeat(18, minmax(0, 1fr))",
        19: "repeat(19, minmax(0, 1fr))",
        29: "repeat(29, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-18": "span 18 / span 18",
        "span-19": "span 19 / span 19",
        "span-29": "span 29 / span 29",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
  ],
};
